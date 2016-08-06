const chai = require('chai');
const assert = chai.assert;

const extensions = [
	'../../extensions/include-file',
	'../../extensions/include'
];

extensions.forEach(function(extensionLoc){
	describe(`Cloudformation Extensions.extensions ${extensionLoc}`, function(){
	
		let extension;

		it('should init fine', function(){
			extension = require(extensionLoc);
		});

		it('should be a function', function(){
			assert.isDefined(extension);
			assert.typeOf(extension, 'Function', 'is a function');
		});

	});
});