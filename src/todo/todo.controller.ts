import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';

@ApiTags("Todo")
@UseGuards(JwtGuard)
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @ApiOperation({
    description: "Create a new user's todo",
    summary: "Create a new user's todo"
  })
  @Post()
  create(@GetUser() user, @Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(user.sub, createTodoDto);
  }

  @ApiOperation({
    description: "Get user's all todos",
    summary: "Get user's all todos",
  })
  @Get()
  findAll(@GetUser("") user) {
    return this.todoService.findAll(user.sub);
  }

  @ApiOperation({
    description: "Get user's todo by id",
    summary: "Get user's todo by id"
  })
  @Get(':id')
  findOne(@GetUser("") user, @Param('id') id: string) {
    return this.todoService.findOne(user.sub, id);
  }

  @ApiOperation({
    description: "Update user's todo by id",
    summary: "Update user's todo by id"
  })
  @Patch(':id')
  update(@GetUser("") user, @Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(user.sub, id, updateTodoDto);
  }

  @ApiOperation({
    description: "Delete user's todo by id",
    summary: "Delete user's todo by id"
  })
  @Delete(':id')
  @HttpCode(204)
  remove(@GetUser("") user, @Param('id') id: string) {
    return this.todoService.remove(user.sub, id);
  }

  @ApiOperation({
    description: "Delete all user's todos",
    summary: "Delete all user's todos"
  })
  @Delete()
  @HttpCode(204)
  removeAll(@GetUser("") user) {
    return this.todoService.removeAll(user.sub);
  }
}
