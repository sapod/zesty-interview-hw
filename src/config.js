module.exports = {
    input_regions_file: '../input/regions.txt',
    output_location: '../output',
    api_port: 3000,
    should_log_debug: false,
};

process.env.AWS_ACCESS_KEY_ID = 'xxx';
process.env.AWS_SECRET_ACCESS_KEY = 'xxx';