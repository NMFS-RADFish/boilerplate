const fs = require('fs');
const path = require('path');

// Path to the root package.json
const rootPackagePath = path.join(__dirname, 'package.json');

// Read root package.json
const rootPackageJson = JSON.parse(fs.readFileSync(rootPackagePath, 'utf-8'));
const rootDependencies = rootPackageJson.dependencies || {};
const rootDevDependencies = rootPackageJson.devDependencies || {};

// Path to the /examples directory
const examplesDir = path.join(__dirname, 'examples');

// Function to compare dependencies and check for missing and mismatched core dependencies (both regular and devDependencies)
const compareDependencies = (examplePackageJson, exampleName) => {
  const exampleDependencies = examplePackageJson.dependencies || {};
  const exampleDevDependencies = examplePackageJson.devDependencies || {};

  const missingDependencies = [];
  const mismatchedDependencies = [];

  // Check core dependencies (root package.json) against example dependencies
  Object.keys(rootDependencies).forEach((dep) => {
    if (!exampleDependencies[dep]) {
      // Dependency is missing in the example
      missingDependencies.push({
        package: dep,
        rootVersion: rootDependencies[dep],
      });
    } else if (exampleDependencies[dep] !== rootDependencies[dep]) {
      // Version mismatch between root and example
      mismatchedDependencies.push({
        package: dep,
        rootVersion: rootDependencies[dep],
        exampleVersion: exampleDependencies[dep],
      });
    }
  });

  // Check core devDependencies (root package.json) against example devDependencies
  Object.keys(rootDevDependencies).forEach((devDep) => {
    if (!exampleDevDependencies[devDep]) {
      // DevDependency is missing in the example
      missingDependencies.push({
        package: devDep,
        rootVersion: rootDevDependencies[devDep],
      });
    } else if (exampleDevDependencies[devDep] !== rootDevDependencies[devDep]) {
      // Version mismatch between root and example
      mismatchedDependencies.push({
        package: devDep,
        rootVersion: rootDevDependencies[devDep],
        exampleVersion: exampleDevDependencies[devDep],
      });
    }
  });

  return { missingDependencies, mismatchedDependencies };
};

// Function to format and log the results
const logResults = (exampleName, missingDependencies, mismatchedDependencies) => {
  console.log(`${exampleName}`);
  
  // Log version mismatches
  if (mismatchedDependencies.length > 0) {
    console.log(`- version mismatches (${mismatchedDependencies.length})`);
    mismatchedDependencies.forEach(({ package, rootVersion, exampleVersion }) => {
      console.log(`   - ${package}: root version (${rootVersion}) vs ${exampleName} version (${exampleVersion})`);
    });
  } else {
    console.log(`- version mismatches (0)`);
  }

  // Log missing dependencies
  if (missingDependencies.length > 0) {
    console.log(`- missing dependencies (${missingDependencies.length})`);
    missingDependencies.forEach(({ package, rootVersion }) => {
      console.log(`   - ${package}: root version (${rootVersion})`);
    });
  } else {
    console.log(`- missing dependencies (0)`);
  }

  console.log(); // Add a blank line between examples
};

// Iterate over each example and check for missing core dependencies and version mismatches
fs.readdirSync(examplesDir).forEach((example) => {
  const examplePackagePath = path.join(examplesDir, example, 'package.json');

  if (fs.existsSync(examplePackagePath)) {
    const examplePackageJson = JSON.parse(fs.readFileSync(examplePackagePath, 'utf-8'));
    const { missingDependencies, mismatchedDependencies } = compareDependencies(examplePackageJson, example);

    // Log the results for this example
    logResults(example, missingDependencies, mismatchedDependencies);
  }
});
