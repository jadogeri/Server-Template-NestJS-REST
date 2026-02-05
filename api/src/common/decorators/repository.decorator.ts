import { SetMetadata, applyDecorators, Injectable } from '@nestjs/common';

// Unique Metadata Keys
export const REPOSITORY_METADATA_KEY = 'is_custom_repository';


// Custom @Repository decorator
export const Repository = () => 
  applyDecorators(
    Injectable(),
    SetMetadata(REPOSITORY_METADATA_KEY, true)
  );
