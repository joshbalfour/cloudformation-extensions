# cloudformation-extensions

[![Build Status](https://travis-ci.com/joshbalfour/cloudformation-extensions.svg?token=MNpwzj1DWBzELMwhWybL&branch=master)](https://travis-ci.com/joshbalfour/cloudformation-extensions)
[![Docker Automated build](https://img.shields.io/docker/automated/joshbalfour/cfnex.svg?maxAge=2592000)]()
[![npm](https://img.shields.io/npm/dm/cloudformation-extensions.svg?maxAge=2592000)]()

Extensions to Amazon's CloudFormation Template JSON format.


## Installation

### Use the Docker Container (recommended)

`docker run -v .:/cfnex joshbalfour/cfnex -i /cfnex/{inFile} -o /cfnex/{outFile}`

(mapping the current directory to /cfnex in the container)

### or grab from NPM
`npm install -g cloudformation-extensions`

`cfnex -i {inFile} -o {outFile}`

## Description
This is designed to make using Amazon's CloudFormation template format easier, more understandable, and more maintainable.
CloudFormation templates are incredibly powerful, but quickly become complicated, and you end up with multiple thousands of lines of JSON which isn't very practical.
Writing CloudFormation templates using cfnex retains the power of vanilla CloudFormation templates whilst increasing readability and maintainability.

Writing a cfnex extension is as easy as creating a function which takes an object and returns a promise. You can find examples of this in [the extensions folder](extensions) and a tutorial [below](#writing-your-own-extensions).


## Writing Cfnex Templates
You write cfnex templates the same way you would regular CloudFormation templates, but with the ability to call cfnex extensions the same way you would "[Intrinsic Functions](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html)" ( `Fn::GetAtt`, `Fn::Join`, etc. ), like so:

`{ "cfnex::extensionName" : [ "aString", {"anObject": "argument2"}, 42 ] }`

Where the array there are the arguments to be passed to the extension.

Out of the box cfnex comes with two extensions:

* `include`
* `includeFile`

`include` allows you to include another JSON or JS file, and `includeFile` allows you to include a raw file.

The output of an extension is then parsed as cfnex template, so you can do things recursively.


## Built-in Extensions

### `include` Extension

#### Example

A raw `cloudformation.json` file which looks like this:

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

Becomes two files:

a root `cloudformation.cfnex.json` file

```
{
    "AWSTemplateFormatVersion" : "2010-09-09",

    "Description" : "projectname Stack",
    "Parameters" : { "cfnex::include" : [ "./parameters.json" ] },

}
```


and a separate `parameters.json` file

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

### `include-file` extension

A raw `cloudformation.json` file which includes this:

```
"UserData" : { "Fn::Base64" : { "Fn::Join" : ["", [
            "#!/bin/bash\n",
            "echo ECS_CLUSTER=", { "Ref": "EcsCluster" }, " >> /etc/ecs/ecs.config"
          ] ] } }
```

a root `cloudformation.cfnex.json` file
```
"UserData" : { "Fn::Base64" : { "cfnex::include-file" : [ "./ec2/boot.sh" ] } }
```

and a separate `./ec2/boot.sh` file

```
#!/bin/bash
echo ECS_CLUSTER=<%cfnex { "Ref": "EcsCluster" } cfnex%>  >> /etc/ecs/ecs.config
```

Note the usage of `<%cfnex` tags in the included file, these can be used to include JSON in the included file.


## Configuration
Your can override where cfnex looks for your extensions by having a `.cfnexrc` JSON file in the directory you run `cfnex` in which looks like this:

```
{
    "extensionsDirectory": "customDirName",
}
```

## Writing your own extensions

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

[License](LICENSE)
