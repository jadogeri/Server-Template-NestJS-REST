import { SetMetadata, applyDecorators, Injectable } from '@nestjs/common';

// Unique Metadata Keys
export const GUARD_METADATA_KEY = 'is_custom_guard';

// Custom @Service decorator
export const Guard = () => 
  applyDecorators(
    Injectable(),
    SetMetadata(GUARD_METADATA_KEY, true)
  );

