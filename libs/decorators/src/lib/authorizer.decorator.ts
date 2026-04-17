import { MetaDataKey } from '@common/constants';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

type Props = {
  secured: boolean;
};
export const Authorization = ({ secured = false }: Props) => {
  const setMetadata = SetMetadata(MetaDataKey.SECURED, {
    secured,
  });
  if (secured) {
    const decorators = [ApiBearerAuth()];
    return applyDecorators(...decorators, setMetadata);
  }
  return setMetadata;
};
