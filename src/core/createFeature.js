import verify      from '../util/verify';
import isString    from 'lodash.isstring';
import isFunction  from 'lodash.isfunction';
import logf        from '../util/logf';

/**
 * Create a new {{book.api.Feature}} object, cataloging
 * {{book.api.AspectContent}} to be consumed by
 * {{book.api.launchApp}}.  Each feature within an application
 * promotes it's own {{book.api.Feature}} object.
 *
 * For more information, please refer to
 * {{book.guide.detail_featureAndAspect}}, with examples at
 * {{book.guide.usage_featureObject}}.
 *
 * **Please Note** this function uses named parameters.
 *
 * @param {string} name the identity of the feature.  Feature names
 * are used to index the {{book.api.App}} Object _(in support of
 * {{book.guide.crossCom}})_, and are therefore guaranteed to be
 * unique.  Application code can also use the Feature name in various
 * **single-source-of-truth** operations _(see {{book.guide.bestPractices}})_.
 * 
 * @param {boolean} [enabled=true] an indicator as to whether this
 * feature is enabled (true) or not (false).  When used, this
 * indicator is typically based on a dynamic expression, allowing
 * packaged code to be dynamically enabled/disabled at run-time
 * _(please refer to: {{book.guide.enablement}})_.
 *
 * @param {Any} [publicFace] an optional resource object that is the
 * feature's Public API, promoting {{book.guide.crossCom}}.  This
 * object is exposed through the {{book.api.App}} object as:
 * `app.{featureName}.{publicFace}` _(please refer to:
 * {{book.guide.crossCom_publicFaceApp}})_.
 *
 * @param {appWillStartCB} [appWillStart] an optional
 * {{book.guide.appLifeCycle}} invoked one time, just before the app
 * starts up.  This life-cycle hook can do any type of initialization,
 * and/or optionally supplement the app's top-level content (using a
 * non-null return) _(please refer to: {{book.guide.appWillStart}})_.
 *
 * @param {appDidStartCB} [appDidStart] an optional
 * {{book.guide.appLifeCycle}} invoked one time, immediately after the
 * app has started.  Because the app is up-and-running at this time,
 * you have access to the appState and the dispatch() function
 * ... assuming you are using redux (when detected by feature-u's
 * plugable aspects) _(please refer to: {{book.guide.appDidStart}})_.
 * 
 * @param {AspectContent} [extendedAspect] additional aspects, as
 * defined by the feature-u's Aspect plugins _(please refer to:
 * {{book.guide.detail_extendableAspects}} -and-
 * {{book.guide.extending}})_.
 *
 * @return {Feature} a new Feature object (to be consumed by
 * launchApp()).
 */
export default function createFeature({name,
                                       enabled=true,

                                       publicFace,

                                       appWillStart,
                                       appDidStart,

                                       ...extendedAspect}={}) {

  // validate createFeature() parameters
  const check = verify.prefix('createFeature() parameter violation: ');

  // ... name
  check(name,            'name is required');
  check(isString(name),  'name must be a string');

  // ... enabled
  check(enabled===true || enabled===false, 'enabled must be a boolean');

  // ... publicFace: nothing to validate (it can be anything)

  // ... appWillStart
  if (appWillStart) {
    check(isFunction(appWillStart), 'appWillStart (when supplied) must be a function');
  }

  // ... appDidStart
  if (appDidStart) {
    check(isFunction(appDidStart), 'appDidStart (when supplied) must be a function');
  }

  // ... extendedAspect
  //     ... this validation occurs by the Aspect itself (via launchApp())
  //         BECAUSE we don't know the Aspects in use UNTIL run-time (in launchApp)

  // create/return our new Feature object
  return {
    name,
    enabled,

    publicFace,

    appWillStart,
    appDidStart,

    ...extendedAspect,
  };
}


/**
 * Maintain all VALID Feature properties.
 *
 * This is used to restrict Feature properties to ONLY valid ones:
 *  - preventing user typos
 *  - validation is employed at run-time in launchApp()
 *
 * Initially seeded with Feature builtins.
 *
 * Later, supplemented with extendFeatureProperty(name, owner) at run-time
 * (via Aspect plugins).
 *
 * @private
 */
const validFeatureProps = {
  name:         'builtin',
  enabled:      'builtin',
  publicFace:   'builtin',
  appWillStart: 'builtin',
  appDidStart:  'builtin',
};

/**
 * Is the supplied name a valid Feature property?
 *
 * @param {string} name the property name to check.
 *
 * @param {boolean} true:  valid Feature property,
 *                  false: NOT a Feature property
 *
 * @private
 */
export function isFeatureProperty(name) {
  return validFeatureProps[name] ? true : false;
}

/**
 * Extend valid Feature properties to include the supplied name
 * ... used when extending APIs for
 * {{book.guide.extending_aspectCrossCommunication}}.
 *
 * **feature-u** keeps track of the agent that owns this extension
 * (using the owner parameter).  This is used to prevent exceptions
 * when duplicate extension requests are made by the same owner.  This
 * can happen when multiple instances of an aspect type are supported,
 * and also in unit testing.
 *
 * @param {string} name the property name to allow.
 *
 * @param {string} owner the requesting owner id of this extension
 * request.  Use any string that uniquely identifies your utility
 * _(such as the aspect's npm package name)_.
 * 
 * @throws {Error} when supplied name is already reserved by a different owner
 */
export function extendFeatureProperty(name, owner) {

  // validate parameters
  const check = verify.prefix('extendFeatureProperty() parameter violation: ');

  check(name,            'name is required');
  check(isString(name),  'name must be a string');

  check(owner,           'owner is required');
  check(isString(owner), 'owner must be a string');

  // verify supplied name is NOT already reserved (by a different owner)
  if (isFeatureProperty(name) &&           // already reserved
      validFeatureProps[name] !== owner) { // by a different owner
    throw new Error(`**ERROR** extendFeatureProperty('${name}', '${owner}') ... 'Feature.${name}' is already reserved by different owner.`);
  }

  // reserve it
  validFeatureProps[name] = owner;
  logf(`invoking: extendFeatureProperty('${name}', '${owner}') ... now validFeatureProps: `, validFeatureProps);
}



//***
//*** Specification: Feature
//***

/**
 * @typedef {Object} Feature
 *
 * The Feature object is a container that holds
 * {{book.api.AspectContent}} that is of interest to **feature-u**.
 * 
 * Each feature within an application promotes a Feature object (using
 * {{book.api.createFeature}}) that catalogs the aspects of that
 * feature.
 * 
 * Ultimately, all Feature objects are consumed by
 * {{book.api.launchApp}}.
 *
 * For more information, please refer to
 * {{book.guide.detail_featureAndAspect}}, with examples at
 * {{book.guide.usage_featureObject}}.
 */


//***
//*** Specification: appWillStartCB
//***

/**
 * An optional {{book.guide.appLifeCycle}} invoked one time, just
 * before the app starts up.
 *
 * This life-cycle hook can do any type of initialization. For
 * example: initialize FireBase.
 *
 * In addition, it can optionally supplement the app's top-level root
 * element (i.e. react component instance).  Any significant return
 * (truthy) is interpreted as the app's new rootAppElm.
 * **IMPORTANT**: When this is used, the supplied curRootAppElm MUST
 * be included as part of this definition (accommodating the
 * accumulative process of other feature injections)!
 *
 * For more information _(with examples)_, please refer to the
 * Guide's {{book.guide.appWillStart}}.
 *
 * **Please Note** this function uses named parameters.
 *
 * @callback appWillStartCB
 * 
 * @param {App} app the App object used in feature cross-communication.
 * 
 * @param {reactElm} curRootAppElm - the current react app element
 * root.
 *
 * @return {reactElm} optionally, new top-level content (which in turn
 * must contain the supplied curRootAppElm), or falsy for unchanged.
 */


//***
//*** Specification: appDidStartCB
//***

/**
 * An optional {{book.guide.appLifeCycle}} invoked one time,
 * immediately after the app has started.
 *
 * Because the app is up-and-running at this time, you have access to
 * the `appState` and `dispatch()` function ... assuming you are using
 * {{book.ext.redux}} (when detected by feature-u's plugable aspects).
 *
 * For more info with examples, please see the Guide's
 * {{book.guide.appDidStart}}.
 *
 * **Please Note** this function uses named parameters.
 *
 * @callback appDidStartCB
 * 
 * @param {App} app the App object used in feature cross-communication.
 * 
 * @param {Any} [appState] - the redux top-level app state (when redux
 * is in use).
 * 
 * @param {function} [dispatch] - the redux dispatch() function (when
 * redux is in use).
 *
 * @return void
 */
