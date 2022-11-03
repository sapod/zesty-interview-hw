const fs = require("fs");
const path = require("path");
const config = require("./config");

module.exports = async (request, reply) => {
    const { region } = request.query;

    if (!region)
        reply.status(400).send({ "statusCode": 400,
            "error": "Bad Request",
            "message": "A URL parameter for the wanted region is mandatory" });
    else {
        try {
            const ec2_list_json = fs.readFileSync(path.resolve(__dirname, config.output_location, region + '.json'), {
                encoding: 'utf8',
                flag: 'r'
            });
            reply.send(JSON.parse(ec2_list_json));
        }
        catch(err) {
            if (err.message.includes('no such file or directory'))
                reply.status(404).send({ "statusCode": 404,
                    "error": "Not Found",
                    "message": "The requested region was not found" });
        }
    }
}