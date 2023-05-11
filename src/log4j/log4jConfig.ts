
import * as path from 'path';
//存放日志文件的地址
const baseLogPath = path.resolve(__dirname,'../../logs');
const log4jsConfig = {
    //输入日志的三种形式
    appenders:{
        console: {
            type:'console', // 打印到控制台
            layout: {
                type:'Awesome-nest',
                separator: '\n'
            }
        },
        info:{
            type:'dateFile', // 文件形式保存
            filename:`${baseLogPath}/info/info.log`,
            alwaysIncludePattern:true,
            pattern: 'yyyyMMdd',
            daysToKeep:30,
            layout: {
                type: 'pattern',
                pattern:
                  '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
              },
        },
        error:{
            type:'dateFile',
            filename:`${baseLogPath}/error/error.log`,
            alwaysIncludePattern:true,
            pattern: 'yyyyMMdd',
            layout: {
                type: 'pattern',
                pattern:
                  '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
              },
        }
    },
    categories: {
        default: {appenders:['console','info','error'],level:'info'},
        info:{appenders:['info'],level:'info'},
        error:{appenders:['error'],level:'error'}
    },
    pm2: true, // 使用 pm2 来管理项目时，打开
    pm2InstanceVar: 'INSTANCE_ID', // 会根据 pm2 分配的 id 进行区分，以免各进程在写日志时造成冲突
}

export default log4jsConfig