const exec = require('child_process').exec;
const assert = require('chai').assert;
const fs = require('fs');

describe('Cloudformation Extensions E2E process', function(){
	
	it('should render the expected file', (done) => {
		const inFile = './example/cfnex-cloudformation.json';
		const outFile = './test/e2e/output.json';
		const command = `./bin/cfnex -i ${inFile} -o ${outFile} -k`;

		exec(command, (error, stderr, stdout) => {
			assert.isNull(error);
			assert.equal(stderr, '');
			assert.equal(stdout, 'OK: Completed\n');
			fs.readFile(inFile, (inFileContents) => {
				let inFileParsed;
				try {
					inFileParsed = JSON.parse(inFileContents);
				} catch (e) {
					assert(!e);
				}
				fs.readFile(inFile, (outFileContents) => {
					let outFileParsed;
					try {
						outFileParsed = JSON.parse(outFileContents);
					} catch (e) {
						assert(!e);
					}
					assert.deepEqual(inFileParsed, outFileParsed);
					done();
				});
			});
		});
	});
	
});