# Table of content 

### feature-u (0.1.0)
* [Getting Started](start.md)

----
* [Basic Concepts](concepts.md)
* [Benefits](benefits.md)
* [Usage](usage.md)
  * [Directory Structure](usage.md#directory-structure)
  * [Feature Object](usage.md#feature-object)
  * [launchApp()](usage.md#launchapp)
  * [Real Example](usage.md#real-example)
* [A Closer Look](detail.md)
  * [aspects](detail.md#aspects)
  * [Feature & aspect content](detail.md#feature-object-relaying-aspect-content)
    * [Built-In aspects](detail.md#built-in-aspects)
    * [Extendable aspects](detail.md#extendable-aspects)
  * [Launching Your Application](detail.md#launching-your-application)
    * [React Registration](detail.md#react-registration)
  * [App Object](detail.md#app-object)
    * [Feature Public API](detail.md#feature-public-api)
    * [Does Feature Exist](detail.md#does-feature-exist)
* [Application Life Cycle Hooks](appLifeCycle.md)
  * [appWillStart](appLifeCycle.md#appwillstart)
  * [appDidStart](appLifeCycle.md#appDidStart)
* [Cross Feature Communication](crossCommunication.md)
  * [publicFace & App](crossCommunication.md#publicface-and-the-app-object)
  * [Accessing App](crossCommunication.md#accessing-the-app-object)
    * [Managed Code Expansion](crossCommunication.md#managed-code-expansion)
    * [App Access Summary](crossCommunication.md#app-access-summary)
* [Feature Based Routes](featureRouter.md)
* [Feature Enablement](enablement.md)
* [Best Practices](bestPractices.md)

----
* [Core API](coreApi.md)
  * [createFeature()](api.md#createFeature)
  * [launchApp()](api.md#launchApp)
  * [managedExpansion()](api.md#managedExpansion)

----
* [Extending feature-u](extending.md)
  * [Locating Extensions](extending.md#locating-extensions)
  * [Aspect Object](extending.md#aspect-object-extending-feature-u)
  * [Defining rootAppElm](extending.md#defining-rootappelm)
  * [Aspect Cross Communication](extending.md#aspect-cross-communication)
  * [Aspect Life Cycle Methods](extending.md#aspect-life-cycle-methods)

  * [Extension API](extensionApi.md)
    * [createAspect()](api.md#createAspect)
    * [extendAspectProperty()](api.md#extendAspectProperty)
    * [extendFeatureProperty()](api.md#extendFeatureProperty)

----
* [Distribution](dist.md)
* [Why feature-u?](why.md)
* [Revision History](history.md)
* [MIT License](LICENSE.md)
