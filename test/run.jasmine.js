import Jasmine from 'jasmine';
import glob from 'glob';
import path from 'path';

var jasmine = new Jasmine();
jasmine.addSpecFiles(glob.sync(path.join(__dirname,'*.test.js')));
jasmine.execute();