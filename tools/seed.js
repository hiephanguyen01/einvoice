#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const index = trimmed.indexOf('=');
    if (index < 0) continue;

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function walkJsonFiles(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkJsonFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files;
}

function convertExtendedJson(value) {
  if (Array.isArray(value)) {
    return value.map(convertExtendedJson);
  }

  if (value && typeof value === 'object') {
    const keys = Object.keys(value);

    if (keys.length === 1 && keys[0] === '$oid' && typeof value.$oid === 'string') {
      return ObjectId.isValid(value.$oid) ? new ObjectId(value.$oid) : value.$oid;
    }

    if (keys.length === 1 && keys[0] === '$date') {
      return new Date(value.$date);
    }

    const result = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = convertExtendedJson(v);
    }
    return result;
  }

  return value;
}

function parseMode(input) {
  const mode = String(input || 'migrate').toLowerCase();
  if (mode === 'prune') return 'prune';
  if (mode === 'migrate' || mode === 'prune') return mode;
  throw new Error('Invalid mode. Please use either "migrate" or "prune".');
}

function getDbNameFromUri(uri) {
  try {
    const parsed = new URL(uri);
    return parsed.pathname.replace(/^\//, '') || undefined;
  } catch {
    return undefined;
  }
}

async function processFile(filePath, mode, db) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const seed = JSON.parse(raw);

  if (!seed || typeof seed !== 'object' || Array.isArray(seed)) {
    throw new Error(`Invalid seed format in file: ${filePath}`);
  }
  if (typeof seed.collection !== 'string' || !Array.isArray(seed.data)) {
    throw new Error(`Seed file must include { collection: string, data: any[] }: ${filePath}`);
  }

  const seedData = convertExtendedJson(seed.data);
  const collection = db.collection(seed.collection);

  if (mode === 'prune') {
    await collection.deleteMany({});
    if (seedData.length > 0) {
      await collection.insertMany(seedData);
    }
    console.log(`[prune] ${seed.collection}: inserted ${seedData.length} docs`);
    return;
  }

  for (const doc of seedData) {
    if (doc && typeof doc === 'object' && doc._id !== undefined) {
      await collection.replaceOne({ _id: doc._id }, doc, { upsert: true });
      continue;
    }

    if (doc && typeof doc === 'object' && typeof doc.name === 'string') {
      await collection.replaceOne({ name: doc.name }, doc, { upsert: true });
      continue;
    }

    await collection.insertOne(doc);
  }

  console.log(`[migrate] ${seed.collection}: upserted/inserted ${seedData.length} docs`);
}

async function bootstrap() {
  const dirPath = process.argv[2] || 'apps/user-access/src/seeder';
  const mode = parseMode(process.argv[3]);
  const absoluteDir = path.resolve(dirPath);

  if (!fs.existsSync(absoluteDir)) {
    console.error('Directory does not exist:', absoluteDir);
    process.exit(1);
  }

  loadEnvFile(path.resolve('.env'));

  const mongoUri = process.env.MONGO_URL || process.env.MONGO_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGO_DB_NAME || getDbNameFromUri(mongoUri) || 'einvoice-app';
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const files = walkJsonFiles(absoluteDir);

    for (const filePath of files) {
      await processFile(filePath, mode, db);
    }
    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Error seeding data:', error?.message || error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

bootstrap();
