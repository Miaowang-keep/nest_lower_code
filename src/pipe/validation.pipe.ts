import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ValidationError, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Log4jsForNest } from 'src/log4j';
import * as utils from '../utils/index';

/*
 ArgumentMetadata 接口中包含三个参数：
   type：参数放在请求的位置 eg:body,param 等
   metatype: 属性的元类型，例如String。 如果在函数签名中省略类型声明，或者使用原生 JavaScript，则为undefined。
   data: 传递给装饰器的字符串
*/
@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    //将普通函数转化为类
    const Ctor = plainToClass(metatype, value)
    //类是否通过校验
    const errorList: ValidationError[] = await validate(Ctor)
    if (errorList && errorList.length) {
      const errorInfo =this.getErrorInfo(this.formatterErrorList(errorList)) 
      Log4jsForNest.error(errorInfo)
      throw new BadRequestException(`Validation failed: ${errorInfo}`)
    }
    return value;
  }
  /**
   * @description 校验数据类型
   * @param value 
   * @returns boolean 
   */
  toValidate(value): Boolean {
    const type: any[] = [String, Boolean, Number, Array, Object];
    return !type.includes(value)
  }

  /**
   * @description 将错误信息数组格式化
   * @param errorList ArgumentMetadata
   * @returns 
   */
  formatterErrorList(errorList: ValidationError[]): any {
    let errorMsgList = []
    if (errorList.length) {
      errorList.forEach(item => {
        const errorItem = {
          property: item.property,
          msg: ''
        }
        if (!utils.isEmptyObject(item.constraints)) {
          errorItem.msg = Object.values(item.constraints).join(',   ')
        }
        errorMsgList.push(errorItem)
        if (item.children?.length) {
          errorMsgList = errorMsgList.concat(this.formatterErrorList(item.children))
        }
      })
    }
    return errorMsgList
  }

  getErrorInfo(arr: any): string {
    let result = ''
    if (arr?.length) {
      result = arr.reduce((last, item) => {
        last += `错误字段： ${item.property} , 错误详细信息: ${item.msg}
        `
       return last
      },'' )
    }
    return result
  }
}
