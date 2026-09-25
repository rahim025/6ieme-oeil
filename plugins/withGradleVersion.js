const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

// EAS Build utilise depuis peu Gradle 8.8 par défaut, ce qui casse
// expo-modules-core (SDK 51) : "Could not get unknown property 'release'
// for SoftwareComponent container...". Ce plugin force la version de
// Gradle générée par `expo prebuild` à revenir à 8.6, compatible avec
// les modules natifs de SDK 51.
module.exports = function withGradleVersion(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const wrapperPath = path.join(
        config.modRequest.platformProjectRoot,
        'gradle',
        'wrapper',
        'gradle-wrapper.properties'
      );

      if (fs.existsSync(wrapperPath)) {
        let contents = fs.readFileSync(wrapperPath, 'utf8');
        contents = contents.replace(
          /^distributionUrl=.*$/m,
          'distributionUrl=https\\://services.gradle.org/distributions/gradle-8.6-all.zip'
        );
        fs.writeFileSync(wrapperPath, contents);
      }

      return config;
    },
  ]);
};
