import { SetMetadata, applyDecorators, Injectable } from '@nestjs/common';

// Unique Metadata Keys
export const STRATEGY_METADATA_KEY = 'is_custom_strategy';

// Custom @Strategy decorator
export const Strategy = () => 
  applyDecorators(
    Injectable(),
    SetMetadata(STRATEGY_METADATA_KEY, true)
  );

