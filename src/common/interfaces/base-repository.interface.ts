import { PaginatedResponseDto } from '../dtos/response/paginated-response.dto';
import { PaginationDto } from '../dtos/request/pagination.dto';

export abstract class IBaseRepository<T, CreateDto = any, UpdateDto = any> {
    abstract findAll(paginationDto: PaginationDto): Promise<PaginatedResponseDto<T>>;
    abstract findOne(id: string): Promise<T | null>;
    abstract create(data: CreateDto): Promise<T>;
    abstract update(id: string, data: UpdateDto): Promise<T>;
    abstract delete(id: string): Promise<void>;
}
