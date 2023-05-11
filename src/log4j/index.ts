import * as log4js from "log4js";
import * as Path from 'path'
import * as dayjs from "dayjs";
import * as StackTrace from "stacktrace-js";
import * as chalk from "chalk";
import log4jsConfig from './log4jConfig'
import { StackFrame } from "stacktrace-js";


// 日志级别
export enum LoggerLevel {
    ALL = 'ALL',
    MARK = 'MARK',
    TRACE = 'TRACE',
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    FATAL = 'FATAL',
    OFF = 'OFF',
}

// 内容跟踪类
export class ContextTrace {
    constructor(
      public readonly context: string,
      public readonly path?: string,
      public readonly lineNumber?: number,
      public readonly columnNumber?: number,
    ) {}
  }
log4js.addLayout('Awesome-nest', (logConfig: any) => {
    return (logEvent: log4js.LoggingEvent) => {
        let moduleName = '';
        let position = '';
        console.log('logEvent: ' + logEvent)
        const messageList :string[] = []
        logEvent.data.forEach((value: any) => {
            if (value instanceof ContextTrace) {
              moduleName = value.context;
              // 显示触发日志的坐标（行，列）
              if (value.lineNumber && value.columnNumber) {
                position = `${value.lineNumber}, ${value.columnNumber}`;
              }
              return;
            }
      
      
            messageList.push(value);
          });
          console.log("chalk",chalk)
              // 日志组成部分
    const messageOutput: string = messageList.join(' ');
    const positionOutput: string = position ? ` [${position}]` : '';
    const typeOutput = `[${logConfig.type}] ${logEvent.pid.toString()}   - `;
    const dateOutput = `${dayjs(logEvent.startTime).format(
      'YYYY-MM-DD HH:mm:ss',
    )}`;
    const moduleOutput: string = moduleName
      ? `[${moduleName}] `
      : '[LoggerService] ';
    let levelOutput = `[${logEvent.level}] ${messageOutput}`;
        // 根据日志级别，用不同颜色区分
       switch (logEvent.level.toString()) {
            case LoggerLevel.DEBUG:
              levelOutput = chalk.green(levelOutput);
              break;
            case LoggerLevel.INFO:
              levelOutput = chalk.cyan(levelOutput);
              break;
            case LoggerLevel.WARN:
              levelOutput = chalk.yellow(levelOutput);
              break;
            case LoggerLevel.ERROR:
              levelOutput = chalk.red(levelOutput);
              break;
            case LoggerLevel.FATAL:
              levelOutput = chalk.hex('#DD4C35')(levelOutput);
              break;
            default:
              levelOutput = chalk.grey(levelOutput);
              break;
          }
          return `${chalk.green(typeOutput)}${dateOutput}  ${chalk.yellow(
            moduleOutput,
          )}${levelOutput}${positionOutput}`; 
    }
})
// 注入配置
log4js.configure(log4jsConfig);

const logger = log4js.getLogger()

export class Log4jsForNest {

    static trace(...args) {
        logger.trace(Log4jsForNest.getStackTrace(), ...args);
    }

    static debug(...args) {
        logger.debug(Log4jsForNest.getStackTrace(), ...args);
    }

    static log(...args) {
        logger.info(Log4jsForNest.getStackTrace(), ...args);
    }

    static info(...args) {
        logger.info(Log4jsForNest.getStackTrace(), ...args);
    }

    static warn(...args) {
        logger.warn(Log4jsForNest.getStackTrace(), ...args);
    }

    static warning(...args) {
        logger.warn(Log4jsForNest.getStackTrace(), ...args);
    }

    static error(...args) {
        logger.error(Log4jsForNest.getStackTrace(), ...args);
    }

    static fatal(...args) {
        logger.fatal(Log4jsForNest.getStackTrace(), ...args);
    }

    static getStackTrace(deep = 2) {
        const stackList: StackTrace.StackFrame[] = StackTrace.getSync()
        const stackItem: StackFrame = stackList[deep]

        //行号 列号  去除路径的基础文件名
        const lineNumber: number = stackItem.lineNumber;
        const columnNumber: number = stackItem.columnNumber;
        const fileName: string = stackItem.fileName;
        const basename: string = Path.basename(fileName);

        return `${basename}(line: ${lineNumber}, column: ${columnNumber}): \n`;

    }
}
