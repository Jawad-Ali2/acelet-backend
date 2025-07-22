import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";


export class UploadPaper {
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @IsNotEmpty()
    year: number;

    @IsString()
    @IsNotEmpty()
    season: string;

    @IsString()
    @IsNotEmpty()
    paperType: string;

    @IsString()
    @ValidateIf(o => !o.subjectId)
    @IsNotEmpty({message: 'Either subjectName or subjectId must be provided'})
    subjectName?: string;

    @IsString()
    @ValidateIf(o => !o.subjectName)
    @IsNotEmpty({message: 'Either subjectName or subjectId must be provided'})
    subjectId?: string;
}