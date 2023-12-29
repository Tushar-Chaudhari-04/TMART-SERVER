const success=(statusCode,message,result)=>{
    return{
        status:"OK",
        statusCode:statusCode,
        message:message,
        result:result
    }
}

const error=(statusCode,message,result)=>{
    return{
        status:"ERROR",
        statusCode:statusCode,
        message:message,
        result:result
    }
}

module.exports={
    success,
    error
}