class EndpointMock {
    constructor(url) {
        this.url = url;
    }
}

class EC2Mock {
    constructor(options) {
        this.options = options;
    }
}

class AWSMock {
    Endpoint = EndpointMock;
    EC2 = EC2Mock;
}

module.exports = AWSMock;