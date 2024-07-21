import { Injectable, HttpException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(userId: string, createTodoDto: CreateTodoDto) {
    const { title, description } = createTodoDto

    const newTodo = await this.prismaService.todo.create({
      data: {
        title,
        description,
        userId,
      },
    })

    return newTodo
  }

  async findAll(userId: string) {
    const allTodos = await this.prismaService.todo.findMany({
      where: {
        userId,
      },
    })

    return allTodos
  }

  async findOne(userId, id: string) {
    const todo = await this.prismaService.todo.findUnique({
      where: {
        id,
        userId,
      },
    })

    if (!todo) {
      throw new HttpException(`Todo with id:${id} not found`, 404)
    }

    return todo;
  }

  async update(userId: string, id: string, updateTodoDto: UpdateTodoDto) {
    const todo = await this.prismaService.todo.findUnique({
      where: {
        id,
        userId,
      },
    })

    if (!todo) {
      throw new HttpException(`Todo with id:${id} not found`, 404)
    }

    const { title, description, status } = updateTodoDto

    const updatedTodo = await this.prismaService.todo.update({
      where: {
        id,
        userId,
      },
      data: {
        title,
        description,
        status,
      },
    })

    return updatedTodo
  }

  async removeAll(userId: string) {
    await this.prismaService.todo.deleteMany({
      where: {
        userId,
      },
    })

    return null
  }

  async remove(userId, id: string) {
    const todo = await this.prismaService.todo.findUnique({
      where: {
        id,
        userId,
      },
    })

    if (!todo) {
      throw new HttpException(`Todo with id:${id} not found`, 404)
    }

    await this.prismaService.todo.delete({
      where: {
        id,
        userId,
      },
    })

    return null;
  }
}
