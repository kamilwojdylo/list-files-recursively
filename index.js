import assert from 'assert';
import fs from 'fs';
import path from 'path';

const filesList = [];

function addFilesFromPath(nextFile, processFile) {
  fs.stat(nextFile, (err, stat) => {
    if (err) {
      throw err;
    }
    if (!stat.isDirectory()) {
      filesList.push(nextFile);
      return processFile();
    }
    listNestedFiles(nextFile, () => {
      processFile();
    });
  });
}

function iterateFiles(dir, filesInDir, cb) {
  let idx = 0;

  function processFile() {
    if (idx === filesInDir.length) {
      return cb(filesList);
    }
    const nextFile = path.join(dir, filesInDir[idx]);

    addFilesFromPath(nextFile, processFile);
    /*
    fs.stat(nextFile, (err, stat) => {
      if (err) {
        throw err;
      }
      if (!stat.isDirectory()) {
        filesList.push(nextFile);
        return processFile();
      }
      listNestedFiles(nextFile, () => {
        processFile();
      });
    });
    */
    idx++;
  }
  processFile();
}

function listNestedFiles(dir, cb) {
  fs.readdir(dir, (err, filesInDir) => {
    iterateFiles(dir, filesInDir, cb);
    /*
    let idx = 0;

    function iterateFiles() {
      if (idx === filesInDir.length) {
        return cb(filesList);
      }
      const nextFile = path.join(dir, filesInDir[idx]);

      fs.stat(nextFile, (err, stat) => {
        if (err) {
          throw err;
        }
        if (!stat.isDirectory()) {
          filesList.push(nextFile);
          return iterateFiles();
        }
        listNestedFiles(nextFile, () => {
          iterateFiles();
        });
      });
      idx++;
    }
    iterateFiles();
    */
  });
}

listNestedFiles('.', files => {
  console.log('Operation done');
  let len = files.length;
  while(len-- > 0) {
    console.log(files[len]);
  }
});
