import { SetMetadata, applyDecorators, Injectable } from '@nestjs/common';

// Unique Metadata Keys
export const SERVICE_METADATA_KEY = 'is_custom_service';

// Custom @Service decorator
export const Service = () => 
  applyDecorators(
    Injectable(),
    SetMetadata(SERVICE_METADATA_KEY, true)
  );

