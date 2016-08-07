# cloudformation-extensions

[![Build Status](https://travis-ci.com/joshbalfour/cloudformation-extensions.svg?token=MNpwzj1DWBzELMwhWybL&branch=master)](https://travis-ci.com/joshbalfour/cloudformation-extensions)

Extensions to Amazon's CloudFormation Template JSON format.

## Description
This is designed to make using Amazon's CloudFormation template format easier, more understandable, and more maintainable.
CloudFormation templates are incredibly powerful, but quickly become complicated, and you end up with multiple thousands of lines of JSON which isn't very practical.
There are other preprocessors out there but I noticed they changed the format so much that it was impossible to use them with any of Amazon's sample snippets.
Writing CloudFormation templates using cfnex retains the power of vanilla CloudFormation templates whilst increasing readability and maintainability.

CloudFormation Extensions is, as the name suggests, incredibly extensible. Writing a cfnex extension is as easy as creating a function which takes an object and returns a promise. You can find examples of this in {directory} and a tutorial {here}.

## What's the difference between cfnex templates and vanilla CloudFormation templates?

In short, not that much. But that's the idea.
Cfnex templates add an extra object format to vanilla CloudFormation templates. The format is much like you'll be used to from calling the [Intrinsic Functions](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html) AWS provide you with when writing cfn templates.
The format is like so:

`{ "cfnex::extensionName" : [ "aString", {"anObject": "argument2"}, 42 ] }`

Where `extensionName` is the name of the extension, and the array is the arguments your want to pass to that extension.


## Built in extensions to cfnex
Out of the box cfnex comes with two extensions:

* `include`
* `includeFile`

`include` allows you to include another JSON or JS file, and `includeFile` allows you to include a raw file.

The output of an extension is then parsed as cfnex template, so you can do things recursively.
![We must go deeper](http://i0.kym-cdn.com/photos/images/facebook/000/531/557/a88.jpg)

## Writing your own

You can write your own extensions by having an `extensions` directory, and within it your custom extensions, where the name of the extension is the filename, so if I wanted to refer to my extension as

`{ "cfnex::includeYaml" : [ "myfile.yml" ] }`

My `extensions` directory would look like this:

```
extensions
    - includeYaml.js
```

A cfnex extension is a function which returns a `Promise` which resolves to be an object.
The function to be ran must be `module.export`ed from the file.
The function will be called with two parameters: `args` and `context`.
`args` is whatever the extension was passed in the cfnex template file, so for our `includeYaml` extension it'd be 

```
[ "myfile.yml" ]
```

`context` is an object which contains two properties:

* `cwd` - String - the absolute current working directory that you're being ran in
* `logger` - Object - a logging helper which has `ok`, `error`, `debug`, and `info` properties for you to use instead of plain `console.log` etc.


The object you return must have a property called `output` which is the output of your extension which will be 
the object can optionally have another property called `contextChanges` which should be an object. You can use this to  override the `context` for any cfnex templates your extension returns.

## Configuration
Your can override where cfnex looks for your extensions by having a `.cfnexrc` JSON file in the directory you run `cfnex` in which looks like this:

```
{
    "extensionsDirectory": "customDirName",
}
```

## Getting Started

### Using the npm module
`npm install -g cloudformation-extensions`

`cfnex {args}`

### Using the Docker Container
`docker build -t cfnex .`

`docker run cfnex {args}`

### Writing cfnex 


## CLI Usage
```
Usage:
  CloudFormation Extensions (cfnex) [OPTIONS] [ARGS]

Options: 
  -i, --inFilePath FILE  Input cfnex JSON file
  -o, --outFilePath DIR  Write to FILE rather than the console
      --cwd DIR          Override the working directory (defaults to the input file's directory)
  -k, --no-color         Omit color from output
      --debug            Show debug information
  -v, --version          Display the current version
  -h, --help             Display help and usage details
 ```

### `include` Extension

#### Example

`cloudformation.json`

```
{

    "AWSTemplateFormatVersion" : "2010-09-09",

    "Description" : "projectname Stack",
    "Parameters" : {
        "s3BucketName" : {
          "Type" : "String",
          "Description" : "S3 Bucket Name",
          "Default" : "project.name"
        },

        "redisSize": {
          "Type" : "String",
          "Description" : "Redis Size",
          "Default" : "cache.t2.micro"
        },

        "rdbmsSize": {
          "Type" : "String",
          "Description" : "RDBMS Size",
          "Default" : "db.t2.micro"
        }
    }

}
```

Becomes

`cloudformation.cfnex.json`

```
{
    "AWSTemplateFormatVersion" : "2010-09-09",

    "Description" : "projectname Stack",
    "Parameters" : { "cfnex::include" : [ "./parameters.json" ] },

}
```


`parameters.json`

```
{
    "s3BucketName" : {
      "Type" : "String",
      "Description" : "S3 Bucket Name",
      "Default" : "project.name"
    },

    "redisSize": {
      "Type" : "String",
      "Description" : "Redis Size",
      "Default" : "cache.t2.micro"
    },

    "rdbmsSize": {
      "Type" : "String",
      "Description" : "RDBMS Size",
      "Default" : "db.t2.micro"
    }
}
```

### Writing cfnex extensions