const SheetApiClinetFactory = require('./sheet_api_client_factory');

async function main(){
    try{
        await SheetApiClinetFactory.create();
    }catch (e){{
        console.error(e);
    }}
}

main();