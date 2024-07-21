import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { TodoStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
    @ApiPropertyOptional()
    @IsEnum(TodoStatus)
    @IsOptional()
    status: TodoStatus
}
