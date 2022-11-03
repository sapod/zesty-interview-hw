const AWS  = require("aws-sdk");
const fs = require('fs');
const path = require('path');
const fastify = require('fastify')();
const config = require('./config');
const ec2_controller = require('./ec2_controller');
const logger = require('./logger');

const log_types = logger.LOG_TYPES;
let aws_endpoint;

/**
 * init needed aws configurations
 */
function init_aws() {
    aws_endpoint = new AWS.Endpoint('localhost:4000');
}

/**
 * The ETL function:
 * reads the file containing the regions
 * lists the ec2 instances in each region
 */
async function etl() {
    // read the regions file
    const regions_str = fs.readFileSync(path.resolve(__dirname, config.input_regions_file), {encoding:'utf8', flag:'r'}).trim();
    const regions = regions_str.split(', ');

    // loop the regions and perform
    for (let region of regions) {
        let ec2 = new AWS.EC2({region, maxRetries: 15, endpoint: aws_endpoint});

        let params = {};
        // For some reason the function does not return,
        // I don't have experience with aws so I didn't manage to find a solution in the given time.
        // the code after receiving the data is based on a guess of how the result is returned
        let t = ec2.describeInstances(params, function(err, data) {
            if (err) logger.write_log(log_types.error, `Failed fetching ec2 list in region ${region}`, err, err.stack); // an error occurred
            else {
                let addresses = data.Addresses;
                addresses = addresses.sort((a,b) => {
                    if (a.launch_time > b.launch_time)
                        return 1;
                    else if ((a.launch_time < b.launch_time))
                        return -1;
                    else return 0;
                });

                fs.writeFileSync(path.resolve(__dirname, config.output_location, region + '.json'), JSON.stringify(addresses));
            }          // successful response
        });

        console.log(t)
    }
}

/**
 * The API function
 */
function api() {
    // setup the controller
    fastify.get('/ec2', ec2_controller);

    // start the api
    const start = async () => {
        await fastify.listen({port: config.api_port}).catch((err) => {
            logger.write_log(log_types.ERROR, 'Failed starting the API', err, err.stack);
            process.exit(1)
        });
        logger.write_log(log_types.INFO, 'API started');
    };
    start();
}

init_aws();
etl();
api();