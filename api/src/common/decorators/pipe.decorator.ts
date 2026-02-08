import { SetMetadata, applyDecorators, Injectable } from '@nestjs/common';

// Unique Metadata Keys
export const PIPE_METADATA_KEY = 'is_custom_pipe';

// Custom @Pipe decorator
export const Pipe = () => 
  applyDecorators(
    Injectable(),
    SetMetadata(PIPE_METADATA_KEY, true)
  );

