import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.BAD_REQUEST;
    const validationErrors = this.flattenValidationErrors(exception);
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Validation failed',
      errors: validationErrors,
    });
  }
  private flattenValidationErrors(exception: ValidationError): any {
    const errors = {};
    this.buildErrorMessages(errors, '', exception);
    return errors;
  }
  private buildErrorMessages(
    errors: any,
    prefix: string,
    validationError: ValidationError,
  ): void {
    for (const property in validationError.constraints) {
      if (validationError.constraints.hasOwnProperty(property)) {
        if (!errors[prefix + property]) {
          errors[prefix + property] = [];
        }
        errors[prefix + property].push(validationError.constraints[property]);
      }
    }
    if (validationError.children && validationError.children.length > 0) {
      validationError.children.forEach((childError) => {
        this.buildErrorMessages(
          errors,
          `${prefix}${childError.property}.`,
          childError,
        );
      });
    }
  }
}
