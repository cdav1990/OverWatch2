import {
  TreeViewItemDepthContext,
  TreeViewProvider,
  createTreeViewDefaultId,
  createUseThemeProps,
  findOrderInTremauxTree,
  generateTreeItemIdAttribute,
  getAllNavigableItems,
  getFirstNavigableItem,
  getLastNavigableItem,
  getNextNavigableItem,
  getNonDisabledItemsInRange,
  getPreviousNavigableItem,
  hasPlugin,
  isTargetInDescendants,
  useTreeViewContext,
  useTreeViewLabel,
  warnOnce
} from "./chunk-BQ7TOBVP.js";
import {
  _objectWithoutPropertiesLoose
} from "./chunk-AVUONKA5.js";
import "./chunk-2AREQCCQ.js";
import {
  styled_default
} from "./chunk-PZDEKNX3.js";
import {
  composeClasses,
  generateUtilityClass,
  generateUtilityClasses,
  ownerDocument,
  require_prop_types,
  useEnhancedEffect_default,
  useEventCallback_default,
  useForkRef,
  useRtl,
  useSlotProps_default
} from "./chunk-TAMEVM6F.js";
import {
  _extends
} from "./chunk-HQ6ZTAWL.js";
import {
  require_jsx_runtime
} from "./chunk-X3C7BU4S.js";
import {
  require_react
} from "./chunk-Z2EBE445.js";
import {
  __toESM
} from "./chunk-PR4QN5HX.js";

// node_modules/@mui/x-tree-view/TreeView/TreeView.js
var React14 = __toESM(require_react());
var import_prop_types3 = __toESM(require_prop_types());

// node_modules/@mui/x-tree-view/TreeView/treeViewClasses.js
function getTreeViewUtilityClass(slot) {
  return generateUtilityClass("MuiTreeView", slot);
}
var treeViewClasses = generateUtilityClasses("MuiTreeView", ["root"]);

// node_modules/@mui/x-tree-view/SimpleTreeView/SimpleTreeView.js
var React13 = __toESM(require_react());
var import_prop_types2 = __toESM(require_prop_types());

// node_modules/@mui/x-tree-view/SimpleTreeView/simpleTreeViewClasses.js
function getSimpleTreeViewUtilityClass(slot) {
  return generateUtilityClass("MuiSimpleTreeView", slot);
}
var simpleTreeViewClasses = generateUtilityClasses("MuiSimpleTreeView", ["root"]);

// node_modules/@mui/x-tree-view/internals/useTreeView/useTreeView.js
var React4 = __toESM(require_react());

// node_modules/@mui/x-tree-view/internals/useTreeView/useTreeViewModels.js
var React = __toESM(require_react());
var useTreeViewModels = (plugins, props) => {
  const modelsRef = React.useRef({});
  const [modelsState, setModelsState] = React.useState(() => {
    const initialState = {};
    plugins.forEach((plugin) => {
      if (plugin.models) {
        Object.entries(plugin.models).forEach(([modelName, modelInitializer]) => {
          modelsRef.current[modelName] = {
            isControlled: props[modelName] !== void 0,
            getDefaultValue: modelInitializer.getDefaultValue
          };
          initialState[modelName] = modelInitializer.getDefaultValue(props);
        });
      }
    });
    return initialState;
  });
  const models = Object.fromEntries(Object.entries(modelsRef.current).map(([modelName, model]) => {
    const value = props[modelName] ?? modelsState[modelName];
    return [modelName, {
      value,
      setControlledValue: (newValue) => {
        if (!model.isControlled) {
          setModelsState((prevState) => _extends({}, prevState, {
            [modelName]: newValue
          }));
        }
      }
    }];
  }));
  if (true) {
    Object.entries(modelsRef.current).forEach(([modelName, model]) => {
      const controlled = props[modelName];
      const newDefaultValue = model.getDefaultValue(props);
      React.useEffect(() => {
        if (model.isControlled !== (controlled !== void 0)) {
          console.error([`MUI X: A component is changing the ${model.isControlled ? "" : "un"}controlled ${modelName} state of TreeView to be ${model.isControlled ? "un" : ""}controlled.`, "Elements should not switch from uncontrolled to controlled (or vice versa).", `Decide between using a controlled or uncontrolled ${modelName} element for the lifetime of the component.`, "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.", "More info: https://fb.me/react-controlled-components"].join("\n"));
        }
      }, [controlled]);
      const {
        current: defaultValue
      } = React.useRef(newDefaultValue);
      React.useEffect(() => {
        if (!model.isControlled && defaultValue !== newDefaultValue) {
          console.error([`MUI X: A component is changing the default ${modelName} state of an uncontrolled TreeView after being initialized. To suppress this warning opt to use a controlled TreeView.`].join("\n"));
        }
      }, [JSON.stringify(newDefaultValue)]);
    });
  }
  return models;
};

// node_modules/@mui/x-tree-view/internals/corePlugins/useTreeViewInstanceEvents/useTreeViewInstanceEvents.js
var React2 = __toESM(require_react());

// node_modules/@mui/x-internals/esm/EventManager/EventManager.js
var EventManager = class {
  constructor() {
    this.maxListeners = 20;
    this.warnOnce = false;
    this.events = {};
  }
  on(eventName, listener, options = {}) {
    let collection = this.events[eventName];
    if (!collection) {
      collection = {
        highPriority: /* @__PURE__ */ new Map(),
        regular: /* @__PURE__ */ new Map()
      };
      this.events[eventName] = collection;
    }
    if (options.isFirst) {
      collection.highPriority.set(listener, true);
    } else {
      collection.regular.set(listener, true);
    }
    if (true) {
      const collectionSize = collection.highPriority.size + collection.regular.size;
      if (collectionSize > this.maxListeners && !this.warnOnce) {
        this.warnOnce = true;
        console.warn([`Possible EventEmitter memory leak detected. ${collectionSize} ${eventName} listeners added.`].join("\n"));
      }
    }
  }
  removeListener(eventName, listener) {
    if (this.events[eventName]) {
      this.events[eventName].regular.delete(listener);
      this.events[eventName].highPriority.delete(listener);
    }
  }
  removeAllListeners() {
    this.events = {};
  }
  emit(eventName, ...args) {
    const collection = this.events[eventName];
    if (!collection) {
      return;
    }
    const highPriorityListeners = Array.from(collection.highPriority.keys());
    const regularListeners = Array.from(collection.regular.keys());
    for (let i = highPriorityListeners.length - 1; i >= 0; i -= 1) {
      const listener = highPriorityListeners[i];
      if (collection.highPriority.has(listener)) {
        listener.apply(this, args);
      }
    }
    for (let i = 0; i < regularListeners.length; i += 1) {
      const listener = regularListeners[i];
      if (collection.regular.has(listener)) {
        listener.apply(this, args);
      }
    }
  }
  once(eventName, listener) {
    const that = this;
    this.on(eventName, function oneTimeListener(...args) {
      that.removeListener(eventName, oneTimeListener);
      listener.apply(that, args);
    });
  }
};

// node_modules/@mui/x-tree-view/internals/corePlugins/useTreeViewInstanceEvents/useTreeViewInstanceEvents.js
var isSyntheticEvent = (event) => {
  return event.isPropagationStopped !== void 0;
};
var useTreeViewInstanceEvents = () => {
  const [eventManager] = React2.useState(() => new EventManager());
  const publishEvent = React2.useCallback((...args) => {
    const [name, params, event = {}] = args;
    event.defaultMuiPrevented = false;
    if (isSyntheticEvent(event) && event.isPropagationStopped()) {
      return;
    }
    eventManager.emit(name, params, event);
  }, [eventManager]);
  const subscribeEvent = React2.useCallback((event, handler) => {
    eventManager.on(event, handler);
    return () => {
      eventManager.removeListener(event, handler);
    };
  }, [eventManager]);
  return {
    instance: {
      $$publishEvent: publishEvent,
      $$subscribeEvent: subscribeEvent
    }
  };
};
useTreeViewInstanceEvents.params = {};

// node_modules/@mui/x-tree-view/internals/corePlugins/useTreeViewOptionalPlugins/useTreeViewOptionalPlugins.js
var useTreeViewOptionalPlugins = ({
  plugins
}) => {
  const pluginSet = new Set(plugins);
  const getAvailablePlugins = () => pluginSet;
  return {
    instance: {
      getAvailablePlugins
    }
  };
};
useTreeViewOptionalPlugins.params = {};

// node_modules/@mui/x-tree-view/internals/corePlugins/useTreeViewId/useTreeViewId.js
var React3 = __toESM(require_react());
var useTreeViewId = ({
  params,
  state,
  setState
}) => {
  React3.useEffect(() => {
    setState((prevState) => {
      if (prevState.id.treeId === params.id && prevState.id.treeId !== void 0) {
        return prevState;
      }
      return _extends({}, prevState, {
        id: _extends({}, prevState.id, {
          treeId: params.id ?? createTreeViewDefaultId()
        })
      });
    });
  }, [setState, params.id]);
  const treeId = params.id ?? state.id.treeId;
  return {
    getRootProps: () => ({
      id: treeId
    }),
    contextValue: {
      treeId
    }
  };
};
useTreeViewId.params = {
  id: true
};
useTreeViewId.getInitialState = ({
  id
}) => ({
  id: {
    treeId: id ?? void 0
  }
});

// node_modules/@mui/x-tree-view/internals/corePlugins/corePlugins.js
var TREE_VIEW_CORE_PLUGINS = [useTreeViewInstanceEvents, useTreeViewOptionalPlugins, useTreeViewId];

// node_modules/@mui/x-tree-view/internals/useTreeView/extractPluginParamsFromProps.js
var _excluded = ["slots", "slotProps", "apiRef", "experimentalFeatures"];
var extractPluginParamsFromProps = (_ref) => {
  let {
    props: {
      slots,
      slotProps,
      apiRef,
      experimentalFeatures: inExperimentalFeatures
    },
    plugins
  } = _ref, props = _objectWithoutPropertiesLoose(_ref.props, _excluded);
  const paramsLookup = {};
  plugins.forEach((plugin) => {
    Object.assign(paramsLookup, plugin.params);
  });
  const pluginParams = {};
  const forwardedProps = {};
  Object.keys(props).forEach((propName) => {
    const prop = props[propName];
    if (paramsLookup[propName]) {
      pluginParams[propName] = prop;
    } else {
      forwardedProps[propName] = prop;
    }
  });
  const experimentalFeatures = inExperimentalFeatures ?? {};
  const defaultizedPluginParams = plugins.reduce((acc, plugin) => {
    if (plugin.getDefaultizedParams) {
      return plugin.getDefaultizedParams({
        params: acc,
        experimentalFeatures
      });
    }
    return acc;
  }, pluginParams);
  return {
    apiRef,
    forwardedProps,
    pluginParams: defaultizedPluginParams,
    slots: slots ?? {},
    slotProps: slotProps ?? {},
    experimentalFeatures
  };
};

// node_modules/@mui/x-tree-view/internals/useTreeView/useTreeViewBuildContext.js
var useTreeViewBuildContext = ({
  plugins,
  instance,
  publicAPI,
  rootRef
}) => {
  const runItemPlugins = (itemPluginProps) => {
    let finalRootRef = null;
    let finalContentRef = null;
    const pluginPropEnhancers = [];
    const pluginPropEnhancersNames = {};
    plugins.forEach((plugin) => {
      if (!plugin.itemPlugin) {
        return;
      }
      const itemPluginResponse = plugin.itemPlugin({
        props: itemPluginProps,
        rootRef: finalRootRef,
        contentRef: finalContentRef
      });
      if (itemPluginResponse?.rootRef) {
        finalRootRef = itemPluginResponse.rootRef;
      }
      if (itemPluginResponse?.contentRef) {
        finalContentRef = itemPluginResponse.contentRef;
      }
      if (itemPluginResponse?.propsEnhancers) {
        pluginPropEnhancers.push(itemPluginResponse.propsEnhancers);
        Object.keys(itemPluginResponse.propsEnhancers).forEach((propsEnhancerName) => {
          pluginPropEnhancersNames[propsEnhancerName] = true;
        });
      }
    });
    const resolvePropsEnhancer = (currentSlotName) => (currentSlotParams) => {
      const enhancedProps = {};
      pluginPropEnhancers.forEach((propsEnhancersForCurrentPlugin) => {
        const propsEnhancerForCurrentPluginAndSlot = propsEnhancersForCurrentPlugin[currentSlotName];
        if (propsEnhancerForCurrentPluginAndSlot != null) {
          Object.assign(enhancedProps, propsEnhancerForCurrentPluginAndSlot(currentSlotParams));
        }
      });
      return enhancedProps;
    };
    const propsEnhancers = Object.fromEntries(Object.keys(pluginPropEnhancersNames).map((propEnhancerName) => [propEnhancerName, resolvePropsEnhancer(propEnhancerName)]));
    return {
      contentRef: finalContentRef,
      rootRef: finalRootRef,
      propsEnhancers
    };
  };
  const wrapItem = ({
    itemId,
    children
  }) => {
    let finalChildren = children;
    for (let i = plugins.length - 1; i >= 0; i -= 1) {
      const plugin = plugins[i];
      if (plugin.wrapItem) {
        finalChildren = plugin.wrapItem({
          itemId,
          children: finalChildren,
          instance
        });
      }
    }
    return finalChildren;
  };
  const wrapRoot = ({
    children
  }) => {
    let finalChildren = children;
    for (let i = plugins.length - 1; i >= 0; i -= 1) {
      const plugin = plugins[i];
      if (plugin.wrapRoot) {
        finalChildren = plugin.wrapRoot({
          children: finalChildren,
          instance
        });
      }
    }
    return finalChildren;
  };
  return {
    runItemPlugins,
    wrapItem,
    wrapRoot,
    instance,
    rootRef,
    publicAPI
  };
};

// node_modules/@mui/x-tree-view/internals/useTreeView/useTreeView.js
function useTreeViewApiInitialization(inputApiRef) {
  const fallbackPublicApiRef = React4.useRef({});
  if (inputApiRef) {
    if (inputApiRef.current == null) {
      inputApiRef.current = {};
    }
    return inputApiRef.current;
  }
  return fallbackPublicApiRef.current;
}
var useTreeView = ({
  plugins: inPlugins,
  rootRef,
  props
}) => {
  const plugins = [...TREE_VIEW_CORE_PLUGINS, ...inPlugins];
  const {
    pluginParams,
    forwardedProps,
    apiRef,
    experimentalFeatures,
    slots,
    slotProps
  } = extractPluginParamsFromProps({
    plugins,
    props
  });
  const models = useTreeViewModels(plugins, pluginParams);
  const instanceRef = React4.useRef({});
  const instance = instanceRef.current;
  const publicAPI = useTreeViewApiInitialization(apiRef);
  const innerRootRef = React4.useRef(null);
  const handleRootRef = useForkRef(innerRootRef, rootRef);
  const contextValue = useTreeViewBuildContext({
    plugins,
    instance,
    publicAPI,
    rootRef: innerRootRef
  });
  const [state, setState] = React4.useState(() => {
    const temp = {};
    plugins.forEach((plugin) => {
      if (plugin.getInitialState) {
        Object.assign(temp, plugin.getInitialState(pluginParams));
      }
    });
    return temp;
  });
  const rootPropsGetters = [];
  const runPlugin = (plugin) => {
    const pluginResponse = plugin({
      instance,
      params: pluginParams,
      slots,
      slotProps,
      experimentalFeatures,
      state,
      setState,
      rootRef: innerRootRef,
      models,
      plugins
    });
    if (pluginResponse.getRootProps) {
      rootPropsGetters.push(pluginResponse.getRootProps);
    }
    if (pluginResponse.publicAPI) {
      Object.assign(publicAPI, pluginResponse.publicAPI);
    }
    if (pluginResponse.instance) {
      Object.assign(instance, pluginResponse.instance);
    }
    if (pluginResponse.contextValue) {
      Object.assign(contextValue, pluginResponse.contextValue);
    }
  };
  plugins.forEach(runPlugin);
  const getRootProps = (otherHandlers = {}) => {
    const rootProps = _extends({
      role: "tree"
    }, forwardedProps, otherHandlers, {
      ref: handleRootRef
    });
    rootPropsGetters.forEach((rootPropsGetter) => {
      Object.assign(rootProps, rootPropsGetter(otherHandlers));
    });
    return rootProps;
  };
  return {
    getRootProps,
    rootRef: handleRootRef,
    contextValue,
    instance
  };
};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewItems/useTreeViewItems.js
var React5 = __toESM(require_react());

// node_modules/@mui/x-tree-view/internals/utils/publishTreeViewEvent.js
var publishTreeViewEvent = (instance, eventName, params) => {
  instance.$$publishEvent(eventName, params);
};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewItems/useTreeViewItems.utils.js
var TREE_VIEW_ROOT_PARENT_ID = "__TREE_VIEW_ROOT_PARENT_ID__";
var buildSiblingIndexes = (siblings) => {
  const siblingsIndexLookup = {};
  siblings.forEach((childId, index) => {
    siblingsIndexLookup[childId] = index;
  });
  return siblingsIndexLookup;
};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewItems/useTreeViewItems.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
var _excluded2 = ["children"];
var updateItemsState = ({
  items,
  isItemDisabled,
  getItemLabel,
  getItemId
}) => {
  const itemMetaMap = {};
  const itemMap = {};
  const itemOrderedChildrenIds = {
    [TREE_VIEW_ROOT_PARENT_ID]: []
  };
  const processItem = (item, depth, parentId) => {
    const id = getItemId ? getItemId(item) : item.id;
    if (id == null) {
      throw new Error(["MUI X: The Tree View component requires all items to have a unique `id` property.", "Alternatively, you can use the `getItemId` prop to specify a custom id for each item.", "An item was provided without id in the `items` prop:", JSON.stringify(item)].join("\n"));
    }
    if (itemMetaMap[id] != null) {
      throw new Error(["MUI X: The Tree View component requires all items to have a unique `id` property.", "Alternatively, you can use the `getItemId` prop to specify a custom id for each item.", `Two items were provided with the same id in the \`items\` prop: "${id}"`].join("\n"));
    }
    const label = getItemLabel ? getItemLabel(item) : item.label;
    if (label == null) {
      throw new Error(["MUI X: The Tree View component requires all items to have a `label` property.", "Alternatively, you can use the `getItemLabel` prop to specify a custom label for each item.", "An item was provided without label in the `items` prop:", JSON.stringify(item)].join("\n"));
    }
    itemMetaMap[id] = {
      id,
      label,
      parentId,
      idAttribute: void 0,
      expandable: !!item.children?.length,
      disabled: isItemDisabled ? isItemDisabled(item) : false,
      depth
    };
    itemMap[id] = item;
    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    if (!itemOrderedChildrenIds[parentIdWithDefault]) {
      itemOrderedChildrenIds[parentIdWithDefault] = [];
    }
    itemOrderedChildrenIds[parentIdWithDefault].push(id);
    item.children?.forEach((child) => processItem(child, depth + 1, id));
  };
  items.forEach((item) => processItem(item, 0, null));
  const itemChildrenIndexes = {};
  Object.keys(itemOrderedChildrenIds).forEach((parentId) => {
    itemChildrenIndexes[parentId] = buildSiblingIndexes(itemOrderedChildrenIds[parentId]);
  });
  return {
    itemMetaMap,
    itemMap,
    itemOrderedChildrenIds,
    itemChildrenIndexes
  };
};
var useTreeViewItems = ({
  instance,
  params,
  state,
  setState,
  experimentalFeatures
}) => {
  const getItemMeta = React5.useCallback((itemId) => state.items.itemMetaMap[itemId], [state.items.itemMetaMap]);
  const getItem = React5.useCallback((itemId) => state.items.itemMap[itemId], [state.items.itemMap]);
  const getItemTree = React5.useCallback(() => {
    const getItemFromItemId = (id) => {
      const _state$items$itemMap$ = state.items.itemMap[id], item = _objectWithoutPropertiesLoose(_state$items$itemMap$, _excluded2);
      const newChildren = state.items.itemOrderedChildrenIds[id];
      if (newChildren) {
        item.children = newChildren.map(getItemFromItemId);
      }
      return item;
    };
    return state.items.itemOrderedChildrenIds[TREE_VIEW_ROOT_PARENT_ID].map(getItemFromItemId);
  }, [state.items.itemMap, state.items.itemOrderedChildrenIds]);
  const isItemDisabled = React5.useCallback((itemId) => {
    if (itemId == null) {
      return false;
    }
    let itemMeta = instance.getItemMeta(itemId);
    if (!itemMeta) {
      return false;
    }
    if (itemMeta.disabled) {
      return true;
    }
    while (itemMeta.parentId != null) {
      itemMeta = instance.getItemMeta(itemMeta.parentId);
      if (itemMeta.disabled) {
        return true;
      }
    }
    return false;
  }, [instance]);
  const getItemIndex = React5.useCallback((itemId) => {
    const parentId = instance.getItemMeta(itemId).parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    return state.items.itemChildrenIndexes[parentId][itemId];
  }, [instance, state.items.itemChildrenIndexes]);
  const getItemOrderedChildrenIds = React5.useCallback((itemId) => state.items.itemOrderedChildrenIds[itemId ?? TREE_VIEW_ROOT_PARENT_ID] ?? [], [state.items.itemOrderedChildrenIds]);
  const getItemDOMElement = (itemId) => {
    const itemMeta = instance.getItemMeta(itemId);
    if (itemMeta == null) {
      return null;
    }
    return document.getElementById(generateTreeItemIdAttribute({
      treeId: state.id.treeId,
      itemId,
      id: itemMeta.idAttribute
    }));
  };
  const isItemNavigable = (itemId) => {
    if (params.disabledItemsFocusable) {
      return true;
    }
    return !instance.isItemDisabled(itemId);
  };
  const areItemUpdatesPreventedRef = React5.useRef(false);
  const preventItemUpdates = React5.useCallback(() => {
    areItemUpdatesPreventedRef.current = true;
  }, []);
  const areItemUpdatesPrevented = React5.useCallback(() => areItemUpdatesPreventedRef.current, []);
  React5.useEffect(() => {
    if (instance.areItemUpdatesPrevented()) {
      return;
    }
    setState((prevState) => {
      const newState = updateItemsState({
        items: params.items,
        isItemDisabled: params.isItemDisabled,
        getItemId: params.getItemId,
        getItemLabel: params.getItemLabel
      });
      Object.values(prevState.items.itemMetaMap).forEach((item) => {
        if (!newState.itemMetaMap[item.id]) {
          publishTreeViewEvent(instance, "removeItem", {
            id: item.id
          });
        }
      });
      return _extends({}, prevState, {
        items: newState
      });
    });
  }, [instance, setState, params.items, params.isItemDisabled, params.getItemId, params.getItemLabel]);
  const getItemsToRender = () => {
    const getPropsFromItemId = (id) => {
      const item = state.items.itemMetaMap[id];
      return {
        label: item.label,
        itemId: item.id,
        id: item.idAttribute,
        children: state.items.itemOrderedChildrenIds[id]?.map(getPropsFromItemId)
      };
    };
    return state.items.itemOrderedChildrenIds[TREE_VIEW_ROOT_PARENT_ID].map(getPropsFromItemId);
  };
  return {
    getRootProps: () => ({
      style: {
        "--TreeView-itemChildrenIndentation": typeof params.itemChildrenIndentation === "number" ? `${params.itemChildrenIndentation}px` : params.itemChildrenIndentation
      }
    }),
    publicAPI: {
      getItem,
      getItemDOMElement,
      getItemTree,
      getItemOrderedChildrenIds
    },
    instance: {
      getItemMeta,
      getItem,
      getItemTree,
      getItemsToRender,
      getItemIndex,
      getItemDOMElement,
      getItemOrderedChildrenIds,
      isItemDisabled,
      isItemNavigable,
      preventItemUpdates,
      areItemUpdatesPrevented
    },
    contextValue: {
      items: {
        onItemClick: params.onItemClick,
        disabledItemsFocusable: params.disabledItemsFocusable,
        indentationAtItemLevel: experimentalFeatures.indentationAtItemLevel ?? false
      }
    }
  };
};
useTreeViewItems.getInitialState = (params) => ({
  items: updateItemsState({
    items: params.items,
    isItemDisabled: params.isItemDisabled,
    getItemId: params.getItemId,
    getItemLabel: params.getItemLabel
  })
});
useTreeViewItems.getDefaultizedParams = ({
  params
}) => _extends({}, params, {
  disabledItemsFocusable: params.disabledItemsFocusable ?? false,
  itemChildrenIndentation: params.itemChildrenIndentation ?? "12px"
});
useTreeViewItems.wrapRoot = ({
  children,
  instance
}) => {
  return (0, import_jsx_runtime.jsx)(TreeViewItemDepthContext.Provider, {
    value: (itemId) => instance.getItemMeta(itemId)?.depth ?? 0,
    children
  });
};
useTreeViewItems.params = {
  disabledItemsFocusable: true,
  items: true,
  isItemDisabled: true,
  getItemLabel: true,
  getItemId: true,
  onItemClick: true,
  itemChildrenIndentation: true
};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewExpansion/useTreeViewExpansion.js
var React6 = __toESM(require_react());
var useTreeViewExpansion = ({
  instance,
  params,
  models
}) => {
  const expandedItemsMap = React6.useMemo(() => {
    const temp = /* @__PURE__ */ new Map();
    models.expandedItems.value.forEach((id) => {
      temp.set(id, true);
    });
    return temp;
  }, [models.expandedItems.value]);
  const setExpandedItems = (event, value) => {
    params.onExpandedItemsChange?.(event, value);
    models.expandedItems.setControlledValue(value);
  };
  const isItemExpanded = React6.useCallback((itemId) => expandedItemsMap.has(itemId), [expandedItemsMap]);
  const isItemExpandable2 = React6.useCallback((itemId) => !!instance.getItemMeta(itemId)?.expandable, [instance]);
  const toggleItemExpansion = useEventCallback_default((event, itemId) => {
    const isExpandedBefore = instance.isItemExpanded(itemId);
    instance.setItemExpansion(event, itemId, !isExpandedBefore);
  });
  const setItemExpansion = useEventCallback_default((event, itemId, isExpanded) => {
    const isExpandedBefore = instance.isItemExpanded(itemId);
    if (isExpandedBefore === isExpanded) {
      return;
    }
    let newExpanded;
    if (isExpanded) {
      newExpanded = [itemId].concat(models.expandedItems.value);
    } else {
      newExpanded = models.expandedItems.value.filter((id) => id !== itemId);
    }
    if (params.onItemExpansionToggle) {
      params.onItemExpansionToggle(event, itemId, isExpanded);
    }
    setExpandedItems(event, newExpanded);
  });
  const expandAllSiblings = (event, itemId) => {
    const itemMeta = instance.getItemMeta(itemId);
    const siblings = instance.getItemOrderedChildrenIds(itemMeta.parentId);
    const diff = siblings.filter((child) => instance.isItemExpandable(child) && !instance.isItemExpanded(child));
    const newExpanded = models.expandedItems.value.concat(diff);
    if (diff.length > 0) {
      if (params.onItemExpansionToggle) {
        diff.forEach((newlyExpandedItemId) => {
          params.onItemExpansionToggle(event, newlyExpandedItemId, true);
        });
      }
      setExpandedItems(event, newExpanded);
    }
  };
  const expansionTrigger = React6.useMemo(() => {
    if (params.expansionTrigger) {
      return params.expansionTrigger;
    }
    if (instance.isTreeViewEditable) {
      return "iconContainer";
    }
    return "content";
  }, [params.expansionTrigger, instance.isTreeViewEditable]);
  return {
    publicAPI: {
      setItemExpansion
    },
    instance: {
      isItemExpanded,
      isItemExpandable: isItemExpandable2,
      setItemExpansion,
      toggleItemExpansion,
      expandAllSiblings
    },
    contextValue: {
      expansion: {
        expansionTrigger
      }
    }
  };
};
useTreeViewExpansion.models = {
  expandedItems: {
    getDefaultValue: (params) => params.defaultExpandedItems
  }
};
var DEFAULT_EXPANDED_ITEMS = [];
useTreeViewExpansion.getDefaultizedParams = ({
  params
}) => _extends({}, params, {
  defaultExpandedItems: params.defaultExpandedItems ?? DEFAULT_EXPANDED_ITEMS
});
useTreeViewExpansion.params = {
  expandedItems: true,
  defaultExpandedItems: true,
  onExpandedItemsChange: true,
  onItemExpansionToggle: true,
  expansionTrigger: true
};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewSelection/useTreeViewSelection.js
var React7 = __toESM(require_react());

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewSelection/useTreeViewSelection.utils.js
var convertSelectedItemsToArray = (model) => {
  if (Array.isArray(model)) {
    return model;
  }
  if (model != null) {
    return [model];
  }
  return [];
};
var getLookupFromArray = (array) => {
  const lookup = {};
  array.forEach((itemId) => {
    lookup[itemId] = true;
  });
  return lookup;
};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewSelection/useTreeViewSelection.js
var useTreeViewSelection = ({
  instance,
  params,
  models
}) => {
  const lastSelectedItem = React7.useRef(null);
  const lastSelectedRange = React7.useRef({});
  const selectedItemsMap = React7.useMemo(() => {
    const temp = /* @__PURE__ */ new Map();
    if (Array.isArray(models.selectedItems.value)) {
      models.selectedItems.value.forEach((id) => {
        temp.set(id, true);
      });
    } else if (models.selectedItems.value != null) {
      temp.set(models.selectedItems.value, true);
    }
    return temp;
  }, [models.selectedItems.value]);
  const setSelectedItems = (event, newSelectedItems) => {
    if (params.onItemSelectionToggle) {
      if (params.multiSelect) {
        const addedItems = newSelectedItems.filter((itemId) => !instance.isItemSelected(itemId));
        const removedItems = models.selectedItems.value.filter((itemId) => !newSelectedItems.includes(itemId));
        addedItems.forEach((itemId) => {
          params.onItemSelectionToggle(event, itemId, true);
        });
        removedItems.forEach((itemId) => {
          params.onItemSelectionToggle(event, itemId, false);
        });
      } else if (newSelectedItems !== models.selectedItems.value) {
        if (models.selectedItems.value != null) {
          params.onItemSelectionToggle(event, models.selectedItems.value, false);
        }
        if (newSelectedItems != null) {
          params.onItemSelectionToggle(event, newSelectedItems, true);
        }
      }
    }
    if (params.onSelectedItemsChange) {
      params.onSelectedItemsChange(event, newSelectedItems);
    }
    models.selectedItems.setControlledValue(newSelectedItems);
  };
  const isItemSelected = (itemId) => selectedItemsMap.has(itemId);
  const selectItem = ({
    event,
    itemId,
    keepExistingSelection = false,
    shouldBeSelected
  }) => {
    if (params.disableSelection) {
      return;
    }
    let newSelected;
    if (keepExistingSelection) {
      const cleanSelectedItems = convertSelectedItemsToArray(models.selectedItems.value);
      const isSelectedBefore = instance.isItemSelected(itemId);
      if (isSelectedBefore && (shouldBeSelected === false || shouldBeSelected == null)) {
        newSelected = cleanSelectedItems.filter((id) => id !== itemId);
      } else if (!isSelectedBefore && (shouldBeSelected === true || shouldBeSelected == null)) {
        newSelected = [itemId].concat(cleanSelectedItems);
      } else {
        newSelected = cleanSelectedItems;
      }
    } else {
      if (shouldBeSelected === false || shouldBeSelected == null && instance.isItemSelected(itemId)) {
        newSelected = params.multiSelect ? [] : null;
      } else {
        newSelected = params.multiSelect ? [itemId] : itemId;
      }
    }
    setSelectedItems(event, newSelected);
    lastSelectedItem.current = itemId;
    lastSelectedRange.current = {};
  };
  const selectRange = (event, [start, end]) => {
    if (params.disableSelection || !params.multiSelect) {
      return;
    }
    let newSelectedItems = convertSelectedItemsToArray(models.selectedItems.value).slice();
    if (Object.keys(lastSelectedRange.current).length > 0) {
      newSelectedItems = newSelectedItems.filter((id) => !lastSelectedRange.current[id]);
    }
    const selectedItemsLookup = getLookupFromArray(newSelectedItems);
    const range = getNonDisabledItemsInRange(instance, start, end);
    const itemsToAddToModel = range.filter((id) => !selectedItemsLookup[id]);
    newSelectedItems = newSelectedItems.concat(itemsToAddToModel);
    setSelectedItems(event, newSelectedItems);
    lastSelectedRange.current = getLookupFromArray(range);
  };
  const expandSelectionRange = (event, itemId) => {
    if (lastSelectedItem.current != null) {
      const [start, end] = findOrderInTremauxTree(instance, itemId, lastSelectedItem.current);
      selectRange(event, [start, end]);
    }
  };
  const selectRangeFromStartToItem = (event, itemId) => {
    selectRange(event, [getFirstNavigableItem(instance), itemId]);
  };
  const selectRangeFromItemToEnd = (event, itemId) => {
    selectRange(event, [itemId, getLastNavigableItem(instance)]);
  };
  const selectAllNavigableItems = (event) => {
    if (params.disableSelection || !params.multiSelect) {
      return;
    }
    const navigableItems = getAllNavigableItems(instance);
    setSelectedItems(event, navigableItems);
    lastSelectedRange.current = getLookupFromArray(navigableItems);
  };
  const selectItemFromArrowNavigation = (event, currentItem, nextItem) => {
    if (params.disableSelection || !params.multiSelect) {
      return;
    }
    let newSelectedItems = convertSelectedItemsToArray(models.selectedItems.value).slice();
    if (Object.keys(lastSelectedRange.current).length === 0) {
      newSelectedItems.push(nextItem);
      lastSelectedRange.current = {
        [currentItem]: true,
        [nextItem]: true
      };
    } else {
      if (!lastSelectedRange.current[currentItem]) {
        lastSelectedRange.current = {};
      }
      if (lastSelectedRange.current[nextItem]) {
        newSelectedItems = newSelectedItems.filter((id) => id !== currentItem);
        delete lastSelectedRange.current[currentItem];
      } else {
        newSelectedItems.push(nextItem);
        lastSelectedRange.current[nextItem] = true;
      }
    }
    setSelectedItems(event, newSelectedItems);
  };
  return {
    getRootProps: () => ({
      "aria-multiselectable": params.multiSelect
    }),
    publicAPI: {
      selectItem
    },
    instance: {
      isItemSelected,
      selectItem,
      selectAllNavigableItems,
      expandSelectionRange,
      selectRangeFromStartToItem,
      selectRangeFromItemToEnd,
      selectItemFromArrowNavigation
    },
    contextValue: {
      selection: {
        multiSelect: params.multiSelect,
        checkboxSelection: params.checkboxSelection,
        disableSelection: params.disableSelection
      }
    }
  };
};
useTreeViewSelection.models = {
  selectedItems: {
    getDefaultValue: (params) => params.defaultSelectedItems
  }
};
var DEFAULT_SELECTED_ITEMS = [];
useTreeViewSelection.getDefaultizedParams = ({
  params
}) => _extends({}, params, {
  disableSelection: params.disableSelection ?? false,
  multiSelect: params.multiSelect ?? false,
  checkboxSelection: params.checkboxSelection ?? false,
  defaultSelectedItems: params.defaultSelectedItems ?? (params.multiSelect ? DEFAULT_SELECTED_ITEMS : null)
});
useTreeViewSelection.params = {
  disableSelection: true,
  multiSelect: true,
  checkboxSelection: true,
  defaultSelectedItems: true,
  selectedItems: true,
  onSelectedItemsChange: true,
  onItemSelectionToggle: true
};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewFocus/useTreeViewFocus.js
var React9 = __toESM(require_react());

// node_modules/@mui/x-tree-view/internals/hooks/useInstanceEventHandler.js
var React8 = __toESM(require_react());

// node_modules/@mui/x-tree-view/internals/utils/cleanupTracking/TimerBasedCleanupTracking.js
var CLEANUP_TIMER_LOOP_MILLIS = 1e3;
var TimerBasedCleanupTracking = class {
  constructor(timeout = CLEANUP_TIMER_LOOP_MILLIS) {
    this.timeouts = /* @__PURE__ */ new Map();
    this.cleanupTimeout = CLEANUP_TIMER_LOOP_MILLIS;
    this.cleanupTimeout = timeout;
  }
  register(object, unsubscribe, unregisterToken) {
    if (!this.timeouts) {
      this.timeouts = /* @__PURE__ */ new Map();
    }
    const timeout = setTimeout(() => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
      this.timeouts.delete(unregisterToken.cleanupToken);
    }, this.cleanupTimeout);
    this.timeouts.set(unregisterToken.cleanupToken, timeout);
  }
  unregister(unregisterToken) {
    const timeout = this.timeouts.get(unregisterToken.cleanupToken);
    if (timeout) {
      this.timeouts.delete(unregisterToken.cleanupToken);
      clearTimeout(timeout);
    }
  }
  reset() {
    if (this.timeouts) {
      this.timeouts.forEach((value, key) => {
        this.unregister({
          cleanupToken: key
        });
      });
      this.timeouts = void 0;
    }
  }
};

// node_modules/@mui/x-tree-view/internals/utils/cleanupTracking/FinalizationRegistryBasedCleanupTracking.js
var FinalizationRegistryBasedCleanupTracking = class {
  constructor() {
    this.registry = new FinalizationRegistry((unsubscribe) => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    });
  }
  register(object, unsubscribe, unregisterToken) {
    this.registry.register(object, unsubscribe, unregisterToken);
  }
  unregister(unregisterToken) {
    this.registry.unregister(unregisterToken);
  }
  // eslint-disable-next-line class-methods-use-this
  reset() {
  }
};

// node_modules/@mui/x-tree-view/internals/hooks/useInstanceEventHandler.js
var ObjectToBeRetainedByReact = class {
};
function createUseInstanceEventHandler(registryContainer2) {
  let cleanupTokensCounter = 0;
  return function useInstanceEventHandler2(instance, eventName, handler) {
    if (registryContainer2.registry === null) {
      registryContainer2.registry = typeof FinalizationRegistry !== "undefined" ? new FinalizationRegistryBasedCleanupTracking() : new TimerBasedCleanupTracking();
    }
    const [objectRetainedByReact] = React8.useState(new ObjectToBeRetainedByReact());
    const subscription = React8.useRef(null);
    const handlerRef = React8.useRef(void 0);
    handlerRef.current = handler;
    const cleanupTokenRef = React8.useRef(null);
    if (!subscription.current && handlerRef.current) {
      const enhancedHandler = (params, event) => {
        if (!event.defaultMuiPrevented) {
          handlerRef.current?.(params, event);
        }
      };
      subscription.current = instance.$$subscribeEvent(eventName, enhancedHandler);
      cleanupTokensCounter += 1;
      cleanupTokenRef.current = {
        cleanupToken: cleanupTokensCounter
      };
      registryContainer2.registry.register(
        objectRetainedByReact,
        // The callback below will be called once this reference stops being retained
        () => {
          subscription.current?.();
          subscription.current = null;
          cleanupTokenRef.current = null;
        },
        cleanupTokenRef.current
      );
    } else if (!handlerRef.current && subscription.current) {
      subscription.current();
      subscription.current = null;
      if (cleanupTokenRef.current) {
        registryContainer2.registry.unregister(cleanupTokenRef.current);
        cleanupTokenRef.current = null;
      }
    }
    React8.useEffect(() => {
      if (!subscription.current && handlerRef.current) {
        const enhancedHandler = (params, event) => {
          if (!event.defaultMuiPrevented) {
            handlerRef.current?.(params, event);
          }
        };
        subscription.current = instance.$$subscribeEvent(eventName, enhancedHandler);
      }
      if (cleanupTokenRef.current && registryContainer2.registry) {
        registryContainer2.registry.unregister(cleanupTokenRef.current);
        cleanupTokenRef.current = null;
      }
      return () => {
        subscription.current?.();
        subscription.current = null;
      };
    }, [instance, eventName]);
  };
}
var registryContainer = {
  registry: null
};
var useInstanceEventHandler = createUseInstanceEventHandler(registryContainer);

// node_modules/@mui/x-tree-view/internals/utils/utils.js
var getActiveElement = (root = document) => {
  const activeEl = root.activeElement;
  if (!activeEl) {
    return null;
  }
  if (activeEl.shadowRoot) {
    return getActiveElement(activeEl.shadowRoot);
  }
  return activeEl;
};
function escapeOperandAttributeSelector(operand) {
  return operand.replace(/["\\]/g, "\\$&");
}

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewFocus/useTreeViewFocus.js
var useDefaultFocusableItemId = (instance, selectedItems) => {
  let tabbableItemId = convertSelectedItemsToArray(selectedItems).find((itemId) => {
    if (!instance.isItemNavigable(itemId)) {
      return false;
    }
    const itemMeta = instance.getItemMeta(itemId);
    return itemMeta && (itemMeta.parentId == null || instance.isItemExpanded(itemMeta.parentId));
  });
  if (tabbableItemId == null) {
    tabbableItemId = getFirstNavigableItem(instance);
  }
  return tabbableItemId;
};
var useTreeViewFocus = ({
  instance,
  params,
  state,
  setState,
  models,
  rootRef
}) => {
  const defaultFocusableItemId = useDefaultFocusableItemId(instance, models.selectedItems.value);
  const setFocusedItemId = useEventCallback_default((itemId) => {
    const cleanItemId = typeof itemId === "function" ? itemId(state.focusedItemId) : itemId;
    if (state.focusedItemId !== cleanItemId) {
      setState((prevState) => _extends({}, prevState, {
        focusedItemId: cleanItemId
      }));
    }
  });
  const isTreeViewFocused = React9.useCallback(() => !!rootRef.current && rootRef.current.contains(getActiveElement(ownerDocument(rootRef.current))), [rootRef]);
  const isItemFocused = React9.useCallback((itemId) => state.focusedItemId === itemId && isTreeViewFocused(), [state.focusedItemId, isTreeViewFocused]);
  const isItemVisible = (itemId) => {
    const itemMeta = instance.getItemMeta(itemId);
    return itemMeta && (itemMeta.parentId == null || instance.isItemExpanded(itemMeta.parentId));
  };
  const innerFocusItem = (event, itemId) => {
    const itemElement = instance.getItemDOMElement(itemId);
    if (itemElement) {
      itemElement.focus();
    }
    setFocusedItemId(itemId);
    if (params.onItemFocus) {
      params.onItemFocus(event, itemId);
    }
  };
  const focusItem = useEventCallback_default((event, itemId) => {
    if (isItemVisible(itemId)) {
      innerFocusItem(event, itemId);
    }
  });
  const removeFocusedItem = useEventCallback_default(() => {
    if (state.focusedItemId == null) {
      return;
    }
    const itemMeta = instance.getItemMeta(state.focusedItemId);
    if (itemMeta) {
      const itemElement = instance.getItemDOMElement(state.focusedItemId);
      if (itemElement) {
        itemElement.blur();
      }
    }
    setFocusedItemId(null);
  });
  const canItemBeTabbed = (itemId) => itemId === defaultFocusableItemId;
  useInstanceEventHandler(instance, "removeItem", ({
    id
  }) => {
    if (state.focusedItemId === id) {
      innerFocusItem(null, defaultFocusableItemId);
    }
  });
  const createRootHandleFocus = (otherHandlers) => (event) => {
    otherHandlers.onFocus?.(event);
    if (event.defaultMuiPrevented) {
      return;
    }
    if (event.target === event.currentTarget) {
      innerFocusItem(event, defaultFocusableItemId);
    }
  };
  return {
    getRootProps: (otherHandlers) => ({
      onFocus: createRootHandleFocus(otherHandlers)
    }),
    publicAPI: {
      focusItem
    },
    instance: {
      isItemFocused,
      canItemBeTabbed,
      focusItem,
      removeFocusedItem
    }
  };
};
useTreeViewFocus.getInitialState = () => ({
  focusedItemId: null
});
useTreeViewFocus.params = {
  onItemFocus: true
};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewKeyboardNavigation/useTreeViewKeyboardNavigation.js
var React10 = __toESM(require_react());
function isPrintableKey(string) {
  return !!string && string.length === 1 && !!string.match(/\S/);
}
var useTreeViewKeyboardNavigation = ({
  instance,
  params,
  state
}) => {
  const isRtl = useRtl();
  const firstCharMap = React10.useRef({});
  const updateFirstCharMap = useEventCallback_default((callback) => {
    firstCharMap.current = callback(firstCharMap.current);
  });
  React10.useEffect(() => {
    if (instance.areItemUpdatesPrevented()) {
      return;
    }
    const newFirstCharMap = {};
    const processItem = (item) => {
      newFirstCharMap[item.id] = item.label.substring(0, 1).toLowerCase();
    };
    Object.values(state.items.itemMetaMap).forEach(processItem);
    firstCharMap.current = newFirstCharMap;
  }, [state.items.itemMetaMap, params.getItemId, instance]);
  const getFirstMatchingItem = (itemId, query) => {
    const cleanQuery = query.toLowerCase();
    const getNextItem = (itemIdToCheck) => {
      const nextItemId = getNextNavigableItem(instance, itemIdToCheck);
      if (nextItemId === null) {
        return getFirstNavigableItem(instance);
      }
      return nextItemId;
    };
    let matchingItemId = null;
    let currentItemId = getNextItem(itemId);
    const checkedItems = {};
    while (matchingItemId == null && !checkedItems[currentItemId]) {
      if (firstCharMap.current[currentItemId] === cleanQuery) {
        matchingItemId = currentItemId;
      } else {
        checkedItems[currentItemId] = true;
        currentItemId = getNextItem(currentItemId);
      }
    }
    return matchingItemId;
  };
  const canToggleItemSelection = (itemId) => !params.disableSelection && !instance.isItemDisabled(itemId);
  const canToggleItemExpansion = (itemId) => {
    return !instance.isItemDisabled(itemId) && instance.isItemExpandable(itemId);
  };
  const handleItemKeyDown = (event, itemId) => {
    if (event.defaultMuiPrevented) {
      return;
    }
    if (event.altKey || isTargetInDescendants(event.target, event.currentTarget)) {
      return;
    }
    const ctrlPressed = event.ctrlKey || event.metaKey;
    const key = event.key;
    switch (true) {
      // Select the item when pressing "Space"
      case (key === " " && canToggleItemSelection(itemId)): {
        event.preventDefault();
        if (params.multiSelect && event.shiftKey) {
          instance.expandSelectionRange(event, itemId);
        } else {
          instance.selectItem({
            event,
            itemId,
            keepExistingSelection: params.multiSelect,
            shouldBeSelected: params.multiSelect ? void 0 : true
          });
        }
        break;
      }
      // If the focused item has children, we expand it.
      // If the focused item has no children, we select it.
      case key === "Enter": {
        if (hasPlugin(instance, useTreeViewLabel) && instance.isItemEditable(itemId) && !instance.isItemBeingEdited(itemId)) {
          instance.setEditedItemId(itemId);
        } else if (canToggleItemExpansion(itemId)) {
          instance.toggleItemExpansion(event, itemId);
          event.preventDefault();
        } else if (canToggleItemSelection(itemId)) {
          if (params.multiSelect) {
            event.preventDefault();
            instance.selectItem({
              event,
              itemId,
              keepExistingSelection: true
            });
          } else if (!instance.isItemSelected(itemId)) {
            instance.selectItem({
              event,
              itemId
            });
            event.preventDefault();
          }
        }
        break;
      }
      // Focus the next focusable item
      case key === "ArrowDown": {
        const nextItem = getNextNavigableItem(instance, itemId);
        if (nextItem) {
          event.preventDefault();
          instance.focusItem(event, nextItem);
          if (params.multiSelect && event.shiftKey && canToggleItemSelection(nextItem)) {
            instance.selectItemFromArrowNavigation(event, itemId, nextItem);
          }
        }
        break;
      }
      // Focuses the previous focusable item
      case key === "ArrowUp": {
        const previousItem = getPreviousNavigableItem(instance, itemId);
        if (previousItem) {
          event.preventDefault();
          instance.focusItem(event, previousItem);
          if (params.multiSelect && event.shiftKey && canToggleItemSelection(previousItem)) {
            instance.selectItemFromArrowNavigation(event, itemId, previousItem);
          }
        }
        break;
      }
      // If the focused item is expanded, we move the focus to its first child
      // If the focused item is collapsed and has children, we expand it
      case (key === "ArrowRight" && !isRtl || key === "ArrowLeft" && isRtl): {
        if (ctrlPressed) {
          return;
        }
        if (instance.isItemExpanded(itemId)) {
          const nextItemId = getNextNavigableItem(instance, itemId);
          if (nextItemId) {
            instance.focusItem(event, nextItemId);
            event.preventDefault();
          }
        } else if (canToggleItemExpansion(itemId)) {
          instance.toggleItemExpansion(event, itemId);
          event.preventDefault();
        }
        break;
      }
      // If the focused item is expanded, we collapse it
      // If the focused item is collapsed and has a parent, we move the focus to this parent
      case (key === "ArrowLeft" && !isRtl || key === "ArrowRight" && isRtl): {
        if (ctrlPressed) {
          return;
        }
        if (canToggleItemExpansion(itemId) && instance.isItemExpanded(itemId)) {
          instance.toggleItemExpansion(event, itemId);
          event.preventDefault();
        } else {
          const parent = instance.getItemMeta(itemId).parentId;
          if (parent) {
            instance.focusItem(event, parent);
            event.preventDefault();
          }
        }
        break;
      }
      // Focuses the first item in the tree
      case key === "Home": {
        if (canToggleItemSelection(itemId) && params.multiSelect && ctrlPressed && event.shiftKey) {
          instance.selectRangeFromStartToItem(event, itemId);
        } else {
          instance.focusItem(event, getFirstNavigableItem(instance));
        }
        event.preventDefault();
        break;
      }
      // Focuses the last item in the tree
      case key === "End": {
        if (canToggleItemSelection(itemId) && params.multiSelect && ctrlPressed && event.shiftKey) {
          instance.selectRangeFromItemToEnd(event, itemId);
        } else {
          instance.focusItem(event, getLastNavigableItem(instance));
        }
        event.preventDefault();
        break;
      }
      // Expand all siblings that are at the same level as the focused item
      case key === "*": {
        instance.expandAllSiblings(event, itemId);
        event.preventDefault();
        break;
      }
      // Multi select behavior when pressing Ctrl + a
      // Selects all the items
      case (String.fromCharCode(event.keyCode) === "A" && ctrlPressed && params.multiSelect && !params.disableSelection): {
        instance.selectAllNavigableItems(event);
        event.preventDefault();
        break;
      }
      // Type-ahead
      // TODO: Support typing multiple characters
      case (!ctrlPressed && !event.shiftKey && isPrintableKey(key)): {
        const matchingItem = getFirstMatchingItem(itemId, key);
        if (matchingItem != null) {
          instance.focusItem(event, matchingItem);
          event.preventDefault();
        }
        break;
      }
    }
  };
  return {
    instance: {
      updateFirstCharMap,
      handleItemKeyDown
    }
  };
};
useTreeViewKeyboardNavigation.params = {};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewIcons/useTreeViewIcons.js
var useTreeViewIcons = ({
  slots,
  slotProps
}) => {
  return {
    contextValue: {
      icons: {
        slots: {
          collapseIcon: slots.collapseIcon,
          expandIcon: slots.expandIcon,
          endIcon: slots.endIcon
        },
        slotProps: {
          collapseIcon: slotProps.collapseIcon,
          expandIcon: slotProps.expandIcon,
          endIcon: slotProps.endIcon
        }
      }
    }
  };
};
useTreeViewIcons.params = {};

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewJSXItems/useTreeViewJSXItems.js
var React12 = __toESM(require_react());

// node_modules/@mui/x-tree-view/internals/TreeViewProvider/TreeViewChildrenItemProvider.js
var React11 = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var TreeViewChildrenItemContext = React11.createContext(null);
if (true) {
  TreeViewChildrenItemContext.displayName = "TreeViewChildrenItemContext";
}
function TreeViewChildrenItemProvider(props) {
  const {
    children,
    itemId = null
  } = props;
  const {
    instance,
    treeId,
    rootRef
  } = useTreeViewContext();
  const childrenIdAttrToIdRef = React11.useRef(/* @__PURE__ */ new Map());
  React11.useEffect(() => {
    if (!rootRef.current) {
      return;
    }
    let idAttr = null;
    if (itemId == null) {
      idAttr = rootRef.current.id;
    } else {
      const itemMeta = instance.getItemMeta(itemId);
      if (itemMeta !== void 0) {
        idAttr = generateTreeItemIdAttribute({
          itemId,
          treeId,
          id: itemMeta.idAttribute
        });
      }
    }
    if (idAttr == null) {
      return;
    }
    const previousChildrenIds = instance.getItemOrderedChildrenIds(itemId ?? null) ?? [];
    const escapedIdAttr = escapeOperandAttributeSelector(idAttr);
    const childrenElements = rootRef.current.querySelectorAll(`${itemId == null ? "" : `*[id="${escapedIdAttr}"] `}[role="treeitem"]:not(*[id="${escapedIdAttr}"] [role="treeitem"] [role="treeitem"])`);
    const childrenIds = Array.from(childrenElements).map((child) => childrenIdAttrToIdRef.current.get(child.id));
    const hasChanged = childrenIds.length !== previousChildrenIds.length || childrenIds.some((childId, index) => childId !== previousChildrenIds[index]);
    if (hasChanged) {
      instance.setJSXItemsOrderedChildrenIds(itemId ?? null, childrenIds);
    }
  });
  const value = React11.useMemo(() => ({
    registerChild: (childIdAttribute, childItemId) => childrenIdAttrToIdRef.current.set(childIdAttribute, childItemId),
    unregisterChild: (childIdAttribute) => childrenIdAttrToIdRef.current.delete(childIdAttribute),
    parentId: itemId
  }), [itemId]);
  return (0, import_jsx_runtime2.jsx)(TreeViewChildrenItemContext.Provider, {
    value,
    children
  });
}
true ? TreeViewChildrenItemProvider.propTypes = {
  children: import_prop_types.default.node,
  id: import_prop_types.default.string
} : void 0;

// node_modules/@mui/x-tree-view/internals/plugins/useTreeViewJSXItems/useTreeViewJSXItems.js
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
var useTreeViewJSXItems = ({
  instance,
  setState
}) => {
  instance.preventItemUpdates();
  const insertJSXItem = useEventCallback_default((item) => {
    setState((prevState) => {
      if (prevState.items.itemMetaMap[item.id] != null) {
        throw new Error(["MUI X: The Tree View component requires all items to have a unique `id` property.", "Alternatively, you can use the `getItemId` prop to specify a custom id for each item.", `Two items were provided with the same id in the \`items\` prop: "${item.id}"`].join("\n"));
      }
      return _extends({}, prevState, {
        items: _extends({}, prevState.items, {
          itemMetaMap: _extends({}, prevState.items.itemMetaMap, {
            [item.id]: item
          }),
          // For Simple Tree View, we don't have a proper `item` object, so we create a very basic one.
          itemMap: _extends({}, prevState.items.itemMap, {
            [item.id]: {
              id: item.id,
              label: item.label
            }
          })
        })
      });
    });
    return () => {
      setState((prevState) => {
        const newItemMetaMap = _extends({}, prevState.items.itemMetaMap);
        const newItemMap = _extends({}, prevState.items.itemMap);
        delete newItemMetaMap[item.id];
        delete newItemMap[item.id];
        return _extends({}, prevState, {
          items: _extends({}, prevState.items, {
            itemMetaMap: newItemMetaMap,
            itemMap: newItemMap
          })
        });
      });
      publishTreeViewEvent(instance, "removeItem", {
        id: item.id
      });
    };
  });
  const setJSXItemsOrderedChildrenIds = (parentId, orderedChildrenIds) => {
    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    setState((prevState) => _extends({}, prevState, {
      items: _extends({}, prevState.items, {
        itemOrderedChildrenIds: _extends({}, prevState.items.itemOrderedChildrenIds, {
          [parentIdWithDefault]: orderedChildrenIds
        }),
        itemChildrenIndexes: _extends({}, prevState.items.itemChildrenIndexes, {
          [parentIdWithDefault]: buildSiblingIndexes(orderedChildrenIds)
        })
      })
    }));
  };
  const mapFirstCharFromJSX = useEventCallback_default((itemId, firstChar) => {
    instance.updateFirstCharMap((firstCharMap) => {
      firstCharMap[itemId] = firstChar;
      return firstCharMap;
    });
    return () => {
      instance.updateFirstCharMap((firstCharMap) => {
        const newMap = _extends({}, firstCharMap);
        delete newMap[itemId];
        return newMap;
      });
    };
  });
  return {
    instance: {
      insertJSXItem,
      setJSXItemsOrderedChildrenIds,
      mapFirstCharFromJSX
    }
  };
};
var isItemExpandable = (reactChildren) => {
  if (Array.isArray(reactChildren)) {
    return reactChildren.length > 0 && reactChildren.some(isItemExpandable);
  }
  return Boolean(reactChildren);
};
var useTreeViewJSXItemsItemPlugin = ({
  props,
  rootRef,
  contentRef
}) => {
  const {
    instance,
    treeId
  } = useTreeViewContext();
  const {
    children,
    disabled = false,
    label,
    itemId,
    id
  } = props;
  const parentContext = React12.useContext(TreeViewChildrenItemContext);
  if (parentContext == null) {
    throw new Error(["MUI X: Could not find the Tree View Children Item context.", "It looks like you rendered your component outside of a SimpleTreeView parent component.", "This can also happen if you are bundling multiple versions of the Tree View."].join("\n"));
  }
  const {
    registerChild,
    unregisterChild,
    parentId
  } = parentContext;
  const expandable = isItemExpandable(children);
  const pluginContentRef = React12.useRef(null);
  const handleContentRef = useForkRef(pluginContentRef, contentRef);
  useEnhancedEffect_default(() => {
    const idAttribute = generateTreeItemIdAttribute({
      itemId,
      treeId,
      id
    });
    registerChild(idAttribute, itemId);
    return () => {
      unregisterChild(idAttribute);
    };
  }, [registerChild, unregisterChild, itemId, id, treeId]);
  React12.useEffect(() => {
    return instance.insertJSXItem({
      id: itemId,
      idAttribute: id,
      parentId,
      expandable,
      disabled
    });
  }, [instance, parentId, itemId, expandable, disabled, id]);
  React12.useEffect(() => {
    if (label) {
      return instance.mapFirstCharFromJSX(itemId, (pluginContentRef.current?.textContent ?? "").substring(0, 1).toLowerCase());
    }
    return void 0;
  }, [instance, itemId, label]);
  return {
    contentRef: handleContentRef,
    rootRef
  };
};
useTreeViewJSXItems.itemPlugin = useTreeViewJSXItemsItemPlugin;
useTreeViewJSXItems.wrapItem = ({
  children,
  itemId
}) => {
  const depthContext = React12.useContext(TreeViewItemDepthContext);
  return (0, import_jsx_runtime3.jsx)(TreeViewChildrenItemProvider, {
    itemId,
    children: (0, import_jsx_runtime3.jsx)(TreeViewItemDepthContext.Provider, {
      value: depthContext + 1,
      children
    })
  });
};
useTreeViewJSXItems.wrapRoot = ({
  children
}) => (0, import_jsx_runtime3.jsx)(TreeViewChildrenItemProvider, {
  children: (0, import_jsx_runtime3.jsx)(TreeViewItemDepthContext.Provider, {
    value: 0,
    children
  })
});
useTreeViewJSXItems.params = {};

// node_modules/@mui/x-tree-view/SimpleTreeView/SimpleTreeView.plugins.js
var SIMPLE_TREE_VIEW_PLUGINS = [useTreeViewItems, useTreeViewExpansion, useTreeViewSelection, useTreeViewFocus, useTreeViewKeyboardNavigation, useTreeViewIcons, useTreeViewJSXItems];

// node_modules/@mui/x-tree-view/SimpleTreeView/SimpleTreeView.js
var import_jsx_runtime4 = __toESM(require_jsx_runtime());
var useThemeProps = createUseThemeProps("MuiSimpleTreeView");
var useUtilityClasses = (ownerState) => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ["root"]
  };
  return composeClasses(slots, getSimpleTreeViewUtilityClass, classes);
};
var SimpleTreeViewRoot = styled_default("ul", {
  name: "MuiSimpleTreeView",
  slot: "Root",
  overridesResolver: (props, styles) => styles.root
})({
  padding: 0,
  margin: 0,
  listStyle: "none",
  outline: 0,
  position: "relative"
});
var EMPTY_ITEMS = [];
var SimpleTreeView = React13.forwardRef(function SimpleTreeView2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: "MuiSimpleTreeView"
  });
  const ownerState = props;
  if (true) {
    if (props.items != null) {
      warnOnce(["MUI X: The Simple Tree View component does not support the `items` prop.", "If you want to add items, you need to pass them as JSX children.", "Check the documentation for more details: https://mui.com/x/react-tree-view/simple-tree-view/items/."]);
    }
  }
  const {
    getRootProps,
    contextValue
  } = useTreeView({
    plugins: SIMPLE_TREE_VIEW_PLUGINS,
    rootRef: ref,
    props: _extends({}, props, {
      items: EMPTY_ITEMS
    })
  });
  const {
    slots,
    slotProps
  } = props;
  const classes = useUtilityClasses(props);
  const Root = slots?.root ?? SimpleTreeViewRoot;
  const rootProps = useSlotProps_default({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    className: classes.root,
    getSlotProps: getRootProps,
    ownerState
  });
  return (0, import_jsx_runtime4.jsx)(TreeViewProvider, {
    value: contextValue,
    children: (0, import_jsx_runtime4.jsx)(Root, _extends({}, rootProps))
  });
});
true ? SimpleTreeView.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The ref object that allows Tree View manipulation. Can be instantiated with `useTreeViewApiRef()`.
   */
  apiRef: import_prop_types2.default.shape({
    current: import_prop_types2.default.shape({
      focusItem: import_prop_types2.default.func.isRequired,
      getItem: import_prop_types2.default.func.isRequired,
      getItemDOMElement: import_prop_types2.default.func.isRequired,
      getItemOrderedChildrenIds: import_prop_types2.default.func.isRequired,
      getItemTree: import_prop_types2.default.func.isRequired,
      selectItem: import_prop_types2.default.func.isRequired,
      setItemExpansion: import_prop_types2.default.func.isRequired
    })
  }),
  /**
   * If `true`, the Tree View renders a checkbox at the left of its label that allows selecting it.
   * @default false
   */
  checkboxSelection: import_prop_types2.default.bool,
  /**
   * The content of the component.
   */
  children: import_prop_types2.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types2.default.object,
  className: import_prop_types2.default.string,
  /**
   * Expanded item ids.
   * Used when the item's expansion is not controlled.
   * @default []
   */
  defaultExpandedItems: import_prop_types2.default.arrayOf(import_prop_types2.default.string),
  /**
   * Selected item ids. (Uncontrolled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   * @default []
   */
  defaultSelectedItems: import_prop_types2.default.any,
  /**
   * If `true`, will allow focus on disabled items.
   * @default false
   */
  disabledItemsFocusable: import_prop_types2.default.bool,
  /**
   * If `true` selection is disabled.
   * @default false
   */
  disableSelection: import_prop_types2.default.bool,
  /**
   * Expanded item ids.
   * Used when the item's expansion is controlled.
   */
  expandedItems: import_prop_types2.default.arrayOf(import_prop_types2.default.string),
  /**
   * The slot that triggers the item's expansion when clicked.
   * @default 'content'
   */
  expansionTrigger: import_prop_types2.default.oneOf(["content", "iconContainer"]),
  /**
   * Unstable features, breaking changes might be introduced.
   * For each feature, if the flag is not explicitly set to `true`,
   * the feature will be fully disabled and any property / method call will not have any effect.
   */
  experimentalFeatures: import_prop_types2.default.shape({
    indentationAtItemLevel: import_prop_types2.default.bool
  }),
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id: import_prop_types2.default.string,
  /**
   * Horizontal indentation between an item and its children.
   * Examples: 24, "24px", "2rem", "2em".
   * @default 12px
   */
  itemChildrenIndentation: import_prop_types2.default.oneOfType([import_prop_types2.default.number, import_prop_types2.default.string]),
  /**
   * If `true`, `ctrl` and `shift` will trigger multiselect.
   * @default false
   */
  multiSelect: import_prop_types2.default.bool,
  /**
   * Callback fired when Tree Items are expanded/collapsed.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {array} itemIds The ids of the expanded items.
   */
  onExpandedItemsChange: import_prop_types2.default.func,
  /**
   * Callback fired when the `content` slot of a given Tree Item is clicked.
   * @param {React.MouseEvent} event The DOM event that triggered the change.
   * @param {string} itemId The id of the focused item.
   */
  onItemClick: import_prop_types2.default.func,
  /**
   * Callback fired when a Tree Item is expanded or collapsed.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {array} itemId The itemId of the modified item.
   * @param {array} isExpanded `true` if the item has just been expanded, `false` if it has just been collapsed.
   */
  onItemExpansionToggle: import_prop_types2.default.func,
  /**
   * Callback fired when a given Tree Item is focused.
   * @param {React.SyntheticEvent | null} event The DOM event that triggered the change. **Warning**: This is a generic event not a focus event.
   * @param {string} itemId The id of the focused item.
   */
  onItemFocus: import_prop_types2.default.func,
  /**
   * Callback fired when a Tree Item is selected or deselected.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {array} itemId The itemId of the modified item.
   * @param {array} isSelected `true` if the item has just been selected, `false` if it has just been deselected.
   */
  onItemSelectionToggle: import_prop_types2.default.func,
  /**
   * Callback fired when Tree Items are selected/deselected.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {string[] | string} itemIds The ids of the selected items.
   * When `multiSelect` is `true`, this is an array of strings; when false (default) a string.
   */
  onSelectedItemsChange: import_prop_types2.default.func,
  /**
   * Selected item ids. (Controlled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   */
  selectedItems: import_prop_types2.default.any,
  /**
   * The props used for each component slot.
   */
  slotProps: import_prop_types2.default.object,
  /**
   * Overridable component slots.
   */
  slots: import_prop_types2.default.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types2.default.oneOfType([import_prop_types2.default.arrayOf(import_prop_types2.default.oneOfType([import_prop_types2.default.func, import_prop_types2.default.object, import_prop_types2.default.bool])), import_prop_types2.default.func, import_prop_types2.default.object])
} : void 0;

// node_modules/@mui/x-tree-view/TreeView/TreeView.js
var import_jsx_runtime5 = __toESM(require_jsx_runtime());
var useThemeProps2 = createUseThemeProps("MuiTreeView");
var useUtilityClasses2 = (ownerState) => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ["root"]
  };
  return composeClasses(slots, getTreeViewUtilityClass, classes);
};
var TreeViewRoot = styled_default(SimpleTreeViewRoot, {
  name: "MuiTreeView",
  slot: "Root",
  overridesResolver: (props, styles) => styles.root
})({});
var warnedOnce = false;
var warn = () => {
  if (!warnedOnce) {
    console.warn(["MUI X: The TreeView component was renamed SimpleTreeView.", "The component with the old naming will be removed in the version v8.0.0.", "", "You should use `import { SimpleTreeView } from '@mui/x-tree-view'`", "or `import { SimpleTreeView } from '@mui/x-tree-view/TreeView'`"].join("\n"));
    warnedOnce = true;
  }
};
var TreeView = React14.forwardRef(function TreeView2(inProps, ref) {
  if (true) {
    warn();
  }
  const props = useThemeProps2({
    props: inProps,
    name: "MuiTreeView"
  });
  const classes = useUtilityClasses2(props);
  return (0, import_jsx_runtime5.jsx)(SimpleTreeView, _extends({}, props, {
    ref,
    classes,
    slots: _extends({
      root: TreeViewRoot
    }, props.slots)
  }));
});
true ? TreeView.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The ref object that allows Tree View manipulation. Can be instantiated with `useTreeViewApiRef()`.
   */
  apiRef: import_prop_types3.default.shape({
    current: import_prop_types3.default.shape({
      focusItem: import_prop_types3.default.func.isRequired,
      getItem: import_prop_types3.default.func.isRequired,
      getItemDOMElement: import_prop_types3.default.func.isRequired,
      getItemOrderedChildrenIds: import_prop_types3.default.func.isRequired,
      getItemTree: import_prop_types3.default.func.isRequired,
      selectItem: import_prop_types3.default.func.isRequired,
      setItemExpansion: import_prop_types3.default.func.isRequired
    })
  }),
  /**
   * If `true`, the Tree View renders a checkbox at the left of its label that allows selecting it.
   * @default false
   */
  checkboxSelection: import_prop_types3.default.bool,
  /**
   * The content of the component.
   */
  children: import_prop_types3.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types3.default.object,
  className: import_prop_types3.default.string,
  /**
   * Expanded item ids.
   * Used when the item's expansion is not controlled.
   * @default []
   */
  defaultExpandedItems: import_prop_types3.default.arrayOf(import_prop_types3.default.string),
  /**
   * Selected item ids. (Uncontrolled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   * @default []
   */
  defaultSelectedItems: import_prop_types3.default.any,
  /**
   * If `true`, will allow focus on disabled items.
   * @default false
   */
  disabledItemsFocusable: import_prop_types3.default.bool,
  /**
   * If `true` selection is disabled.
   * @default false
   */
  disableSelection: import_prop_types3.default.bool,
  /**
   * Expanded item ids.
   * Used when the item's expansion is controlled.
   */
  expandedItems: import_prop_types3.default.arrayOf(import_prop_types3.default.string),
  /**
   * The slot that triggers the item's expansion when clicked.
   * @default 'content'
   */
  expansionTrigger: import_prop_types3.default.oneOf(["content", "iconContainer"]),
  /**
   * Unstable features, breaking changes might be introduced.
   * For each feature, if the flag is not explicitly set to `true`,
   * the feature will be fully disabled and any property / method call will not have any effect.
   */
  experimentalFeatures: import_prop_types3.default.shape({
    indentationAtItemLevel: import_prop_types3.default.bool
  }),
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id: import_prop_types3.default.string,
  /**
   * Horizontal indentation between an item and its children.
   * Examples: 24, "24px", "2rem", "2em".
   * @default 12px
   */
  itemChildrenIndentation: import_prop_types3.default.oneOfType([import_prop_types3.default.number, import_prop_types3.default.string]),
  /**
   * If `true`, `ctrl` and `shift` will trigger multiselect.
   * @default false
   */
  multiSelect: import_prop_types3.default.bool,
  /**
   * Callback fired when Tree Items are expanded/collapsed.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {array} itemIds The ids of the expanded items.
   */
  onExpandedItemsChange: import_prop_types3.default.func,
  /**
   * Callback fired when the `content` slot of a given Tree Item is clicked.
   * @param {React.MouseEvent} event The DOM event that triggered the change.
   * @param {string} itemId The id of the focused item.
   */
  onItemClick: import_prop_types3.default.func,
  /**
   * Callback fired when a Tree Item is expanded or collapsed.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {array} itemId The itemId of the modified item.
   * @param {array} isExpanded `true` if the item has just been expanded, `false` if it has just been collapsed.
   */
  onItemExpansionToggle: import_prop_types3.default.func,
  /**
   * Callback fired when a given Tree Item is focused.
   * @param {React.SyntheticEvent | null} event The DOM event that triggered the change. **Warning**: This is a generic event not a focus event.
   * @param {string} itemId The id of the focused item.
   */
  onItemFocus: import_prop_types3.default.func,
  /**
   * Callback fired when a Tree Item is selected or deselected.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {array} itemId The itemId of the modified item.
   * @param {array} isSelected `true` if the item has just been selected, `false` if it has just been deselected.
   */
  onItemSelectionToggle: import_prop_types3.default.func,
  /**
   * Callback fired when Tree Items are selected/deselected.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {string[] | string} itemIds The ids of the selected items.
   * When `multiSelect` is `true`, this is an array of strings; when false (default) a string.
   */
  onSelectedItemsChange: import_prop_types3.default.func,
  /**
   * Selected item ids. (Controlled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   */
  selectedItems: import_prop_types3.default.any,
  /**
   * The props used for each component slot.
   */
  slotProps: import_prop_types3.default.object,
  /**
   * Overridable component slots.
   */
  slots: import_prop_types3.default.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types3.default.oneOfType([import_prop_types3.default.arrayOf(import_prop_types3.default.oneOfType([import_prop_types3.default.func, import_prop_types3.default.object, import_prop_types3.default.bool])), import_prop_types3.default.func, import_prop_types3.default.object])
} : void 0;
export {
  TreeView,
  getTreeViewUtilityClass,
  treeViewClasses
};
//# sourceMappingURL=@mui_x-tree-view_TreeView.js.map
