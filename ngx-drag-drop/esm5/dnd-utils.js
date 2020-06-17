/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function DragDropData() { }
if (false) {
    /** @type {?|undefined} */
    DragDropData.prototype.data;
    /** @type {?|undefined} */
    DragDropData.prototype.type;
}
/**
 * @record
 */
export function DndEvent() { }
if (false) {
    /** @type {?|undefined} */
    DndEvent.prototype._dndUsingHandle;
    /** @type {?|undefined} */
    DndEvent.prototype._dndDropzoneActive;
}
/** @type {?} */
export var DROP_EFFECTS = (/** @type {?} */ (["move", "copy", "link"]));
/** @type {?} */
export var CUSTOM_MIME_TYPE = "application/x-dnd";
/** @type {?} */
export var JSON_MIME_TYPE = "application/json";
/** @type {?} */
export var MSIE_MIME_TYPE = "Text";
/**
 * @param {?} mimeType
 * @return {?}
 */
function mimeTypeIsCustom(mimeType) {
    return mimeType.substr(0, CUSTOM_MIME_TYPE.length) === CUSTOM_MIME_TYPE;
}
/**
 * @param {?} event
 * @return {?}
 */
export function getWellKnownMimeType(event) {
    if (event.dataTransfer) {
        /** @type {?} */
        var types = event.dataTransfer.types;
        // IE 9 workaround.
        if (!types) {
            return MSIE_MIME_TYPE;
        }
        for (var i = 0; i < types.length; i++) {
            if (types[i] === MSIE_MIME_TYPE
                || types[i] === JSON_MIME_TYPE
                || mimeTypeIsCustom(types[i])) {
                return types[i];
            }
        }
    }
    return null;
}
/**
 * @param {?} event
 * @param {?} data
 * @param {?} effectAllowed
 * @return {?}
 */
export function setDragData(event, data, effectAllowed) {
    // Internet Explorer and Microsoft Edge don't support custom mime types, see design doc:
    // https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
    /** @type {?} */
    var mimeType = CUSTOM_MIME_TYPE + (data.type ? ("-" + data.type) : "");
    /** @type {?} */
    var dataString = JSON.stringify(data);
    try {
        event.dataTransfer.setData(mimeType, dataString);
    }
    catch (e) {
        //   Setting a custom MIME type did not work, we are probably in IE or Edge.
        try {
            event.dataTransfer.setData(JSON_MIME_TYPE, dataString);
        }
        catch (e) {
            //   We are in Internet Explorer and can only use the Text MIME type. Also note that IE
            //   does not allow changing the cursor in the dragover event, therefore we have to choose
            //   the one we want to display now by setting effectAllowed.
            /** @type {?} */
            var effectsAllowed = filterEffects(DROP_EFFECTS, effectAllowed);
            event.dataTransfer.effectAllowed = effectsAllowed[0];
            /*
            BUG FIX - ISSUE: in IE11 when dragging in a NEW Workflow Node the clipboard gets overwritten with the
            node model JSON data when event.dataTransfer.setData() below is called.
            this causes issues when a user has previously copied text to the clipboard with the idea of pasting it,
            as the user's intended data to paste is overwritten just by doing an un-related action ie: simply dragging in a New Workflow Node.
      
            BUG FIX: store the value of clipboard before event.dataTransfer.setData() is called and then restore the data to clipboard.
          */
            try {
                if (window['clipboardData'] && window['clipboardData'].getData('Text')) {
                    /** @type {?} */
                    var preTransferClipboardData = window['clipboardData'].getData('Text');
                }
            }
            catch (e) {
                //do nothing just swallow any clipboard related errors
            }
            event.dataTransfer.setData(MSIE_MIME_TYPE, dataString);
            // clipboard data is restored here as part of BUG FIX referenced above
            try {
                if (window['clipboardData'] && preTransferClipboardData) {
                    window['clipboardData'].setData('Text', preTransferClipboardData);
                }
            }
            catch (e) {
                //do nothing just swallow any clipboard related errors
            }
        }
    }
}
/**
 * @param {?} event
 * @param {?} dragIsExternal
 * @return {?}
 */
export function getDropData(event, dragIsExternal) {
    // check if the mime type is well known
    /** @type {?} */
    var mimeType = getWellKnownMimeType(event);
    // drag did not originate from [dndDraggable]
    if (dragIsExternal === true) {
        if (mimeType !== null
            && mimeTypeIsCustom(mimeType)) {
            // the type of content is well known and safe to handle
            return JSON.parse(event.dataTransfer.getData(mimeType));
        }
        // the contained data is unknown, let user handle it
        return {};
    }
    // the type of content is well known and safe to handle
    return JSON.parse(event.dataTransfer.getData(mimeType));
}
/**
 * @param {?} effects
 * @param {?} allowed
 * @return {?}
 */
export function filterEffects(effects, allowed) {
    if (allowed === "all"
        || allowed === "uninitialized") {
        return effects;
    }
    return effects.filter((/**
     * @param {?} effect
     * @return {?}
     */
    function (effect) {
        return allowed.toLowerCase().indexOf(effect) !== -1;
    }));
}
/**
 * @param {?} parentElement
 * @param {?} childElement
 * @return {?}
 */
export function getDirectChildElement(parentElement, childElement) {
    /** @type {?} */
    var directChild = childElement;
    while (directChild.parentNode !== parentElement) {
        // reached root node without finding given parent
        if (!directChild.parentNode) {
            return null;
        }
        directChild = directChild.parentNode;
    }
    return (/** @type {?} */ (directChild));
}
/**
 * @param {?} event
 * @param {?} element
 * @param {?} horizontal
 * @return {?}
 */
export function shouldPositionPlaceholderBeforeElement(event, element, horizontal) {
    /** @type {?} */
    var bounds = element.getBoundingClientRect();
    // If the pointer is in the upper half of the list item element,
    // we position the placeholder before the list item, otherwise after it.
    if (horizontal) {
        return (event.clientX < bounds.left + bounds.width / 2);
    }
    return (event.clientY < bounds.top + bounds.height / 2);
}
/**
 * @param {?} event
 * @param {?} dragImage
 * @return {?}
 */
export function calculateDragImageOffset(event, dragImage) {
    /** @type {?} */
    var dragImageComputedStyle = window.getComputedStyle(dragImage);
    /** @type {?} */
    var paddingTop = parseFloat(dragImageComputedStyle.paddingTop) || 0;
    /** @type {?} */
    var paddingLeft = parseFloat(dragImageComputedStyle.paddingLeft) || 0;
    /** @type {?} */
    var borderTop = parseFloat(dragImageComputedStyle.borderTopWidth) || 0;
    /** @type {?} */
    var borderLeft = parseFloat(dragImageComputedStyle.borderLeftWidth) || 0;
    return {
        x: event.offsetX + paddingLeft + borderLeft,
        y: event.offsetY + paddingTop + borderTop
    };
}
/**
 * @param {?} event
 * @param {?} dragImage
 * @param {?} offsetFunction
 * @return {?}
 */
export function setDragImage(event, dragImage, offsetFunction) {
    /** @type {?} */
    var offset = offsetFunction(event, dragImage) || { x: 0, y: 0 };
    ((/** @type {?} */ (event.dataTransfer))).setDragImage(dragImage, offset.x, offset.y);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG5kLXV0aWxzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRyYWctZHJvcC8iLCJzb3VyY2VzIjpbImRuZC11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUEsa0NBR0M7OztJQUZDLDRCQUFVOztJQUNWLDRCQUFhOzs7OztBQUdmLDhCQUdDOzs7SUFGQyxtQ0FBeUI7O0lBQ3pCLHNDQUF5Qjs7O0FBSzNCLE1BQU0sS0FBTyxZQUFZLEdBQUcsbUJBQUEsQ0FBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBRSxFQUFnQjs7QUFFdEUsTUFBTSxLQUFPLGdCQUFnQixHQUFHLG1CQUFtQjs7QUFDbkQsTUFBTSxLQUFPLGNBQWMsR0FBRyxrQkFBa0I7O0FBQ2hELE1BQU0sS0FBTyxjQUFjLEdBQUcsTUFBTTs7Ozs7QUFFcEMsU0FBUyxnQkFBZ0IsQ0FBRSxRQUFlO0lBRXhDLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBRSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxDQUFFLEtBQUssZ0JBQWdCLENBQUM7QUFDNUUsQ0FBQzs7Ozs7QUFFRCxNQUFNLFVBQVUsb0JBQW9CLENBQUUsS0FBZTtJQUVuRCxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUc7O1lBRWpCLEtBQUssR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUs7UUFFdEMsbUJBQW1CO1FBQ25CLElBQUksQ0FBQyxLQUFLLEVBQUc7WUFFWCxPQUFPLGNBQWMsQ0FBQztTQUN2QjtRQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFHO1lBRXRDLElBQUksS0FBSyxDQUFFLENBQUMsQ0FBRSxLQUFLLGNBQWM7bUJBQzVCLEtBQUssQ0FBRSxDQUFDLENBQUUsS0FBSyxjQUFjO21CQUM3QixnQkFBZ0IsQ0FBRSxLQUFLLENBQUUsQ0FBQyxDQUFFLENBQUUsRUFBRztnQkFFcEMsT0FBTyxLQUFLLENBQUUsQ0FBQyxDQUFFLENBQUM7YUFDbkI7U0FDRjtLQUNGO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDOzs7Ozs7O0FBRUQsTUFBTSxVQUFVLFdBQVcsQ0FBRSxLQUFlLEVBQUUsSUFBaUIsRUFBRSxhQUEyQjs7OztRQUlwRixRQUFRLEdBQUcsZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7UUFFbEUsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUUsSUFBSSxDQUFFO0lBRXpDLElBQUk7UUFFRixLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBRSxRQUFRLEVBQUUsVUFBVSxDQUFFLENBQUM7S0FFcEQ7SUFDRCxPQUFPLENBQUMsRUFBRztRQUVULDRFQUE0RTtRQUM1RSxJQUFJO1lBRUYsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUUsY0FBYyxFQUFFLFVBQVUsQ0FBRSxDQUFDO1NBRTFEO1FBQ0QsT0FBTyxDQUFDLEVBQUc7Ozs7O2dCQUtILGNBQWMsR0FBRyxhQUFhLENBQUUsWUFBWSxFQUFFLGFBQWEsQ0FBRTtZQUNuRSxLQUFLLENBQUMsWUFBWSxDQUFDLGFBQWEsR0FBRyxjQUFjLENBQUUsQ0FBQyxDQUFFLENBQUM7WUFFdkQ7Ozs7Ozs7WUFPQTtZQUNGLElBQUk7Z0JBQ0YsSUFBRyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTs7d0JBQ2pFLHdCQUF3QixHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO2lCQUN2RTthQUNGO1lBQUMsT0FBTSxDQUFDLEVBQUM7Z0JBQ1Isc0RBQXNEO2FBQ3ZEO1lBRUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUUsY0FBYyxFQUFFLFVBQVUsQ0FBRSxDQUFDO1lBRTNELHNFQUFzRTtZQUN0RSxJQUFJO2dCQUNFLElBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLHdCQUF3QixFQUFDO29CQUN2RCxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO2lCQUNqRTthQUNGO1lBQUMsT0FBTSxDQUFDLEVBQUM7Z0JBQ1Isc0RBQXNEO2FBQ3ZEO1NBQ0o7S0FDRjtBQUNILENBQUM7Ozs7OztBQUVELE1BQU0sVUFBVSxXQUFXLENBQUUsS0FBZSxFQUFFLGNBQXNCOzs7UUFHNUQsUUFBUSxHQUFHLG9CQUFvQixDQUFFLEtBQUssQ0FBRTtJQUU5Qyw2Q0FBNkM7SUFDN0MsSUFBSSxjQUFjLEtBQUssSUFBSSxFQUFHO1FBRTVCLElBQUksUUFBUSxLQUFLLElBQUk7ZUFDaEIsZ0JBQWdCLENBQUUsUUFBUSxDQUFFLEVBQUc7WUFFbEMsdURBQXVEO1lBQ3ZELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBRSxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBRSxRQUFRLENBQUUsQ0FBRSxDQUFDO1NBQzdEO1FBRUQsb0RBQW9EO1FBQ3BELE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFFRCx1REFBdUQ7SUFDdkQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFFLFFBQVEsQ0FBRSxDQUFFLENBQUM7QUFDOUQsQ0FBQzs7Ozs7O0FBRUQsTUFBTSxVQUFVLGFBQWEsQ0FBRSxPQUFvQixFQUFFLE9BQWtDO0lBRXJGLElBQUksT0FBTyxLQUFLLEtBQUs7V0FDaEIsT0FBTyxLQUFLLGVBQWUsRUFBRztRQUVqQyxPQUFPLE9BQU8sQ0FBQztLQUNoQjtJQUVELE9BQU8sT0FBTyxDQUFDLE1BQU07Ozs7SUFBRSxVQUFVLE1BQU07UUFFckMsT0FBTyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFFLE1BQU0sQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUMsRUFBRSxDQUFDO0FBQ04sQ0FBQzs7Ozs7O0FBRUQsTUFBTSxVQUFVLHFCQUFxQixDQUFFLGFBQXFCLEVBQUUsWUFBb0I7O1FBRTVFLFdBQVcsR0FBUSxZQUFZO0lBRW5DLE9BQU8sV0FBVyxDQUFDLFVBQVUsS0FBSyxhQUFhLEVBQUc7UUFFaEQsaURBQWlEO1FBQ2pELElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFHO1lBRTVCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxXQUFXLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQztLQUN0QztJQUVELE9BQU8sbUJBQUEsV0FBVyxFQUFXLENBQUM7QUFDaEMsQ0FBQzs7Ozs7OztBQUVELE1BQU0sVUFBVSxzQ0FBc0MsQ0FBRSxLQUFlLEVBQUUsT0FBZSxFQUFFLFVBQWtCOztRQUVwRyxNQUFNLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixFQUFFO0lBRTlDLGdFQUFnRTtJQUNoRSx3RUFBd0U7SUFDeEUsSUFBSSxVQUFVLEVBQUc7UUFFZixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDekQ7SUFFRCxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUQsQ0FBQzs7Ozs7O0FBRUQsTUFBTSxVQUFVLHdCQUF3QixDQUFFLEtBQWUsRUFBRSxTQUFpQjs7UUFFcEUsc0JBQXNCLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFFLFNBQVMsQ0FBRTs7UUFDN0QsVUFBVSxHQUFHLFVBQVUsQ0FBRSxzQkFBc0IsQ0FBQyxVQUFVLENBQUUsSUFBSSxDQUFDOztRQUNqRSxXQUFXLEdBQUcsVUFBVSxDQUFFLHNCQUFzQixDQUFDLFdBQVcsQ0FBRSxJQUFJLENBQUM7O1FBQ25FLFNBQVMsR0FBRyxVQUFVLENBQUUsc0JBQXNCLENBQUMsY0FBYyxDQUFFLElBQUksQ0FBQzs7UUFDcEUsVUFBVSxHQUFHLFVBQVUsQ0FBRSxzQkFBc0IsQ0FBQyxlQUFlLENBQUUsSUFBSSxDQUFDO0lBRTVFLE9BQU87UUFDTCxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sR0FBRyxXQUFXLEdBQUcsVUFBVTtRQUMzQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sR0FBRyxVQUFVLEdBQUcsU0FBUztLQUMxQyxDQUFDO0FBQ0osQ0FBQzs7Ozs7OztBQUVELE1BQU0sVUFBVSxZQUFZLENBQUUsS0FBZSxFQUFFLFNBQWlCLEVBQUUsY0FBeUM7O1FBRW5HLE1BQU0sR0FBRyxjQUFjLENBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBRSxJQUFJLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDO0lBRWpFLENBQUMsbUJBQUEsS0FBSyxDQUFDLFlBQVksRUFBTyxDQUFDLENBQUMsWUFBWSxDQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUUsQ0FBQztBQUM1RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHJvcEVmZmVjdCwgRWZmZWN0QWxsb3dlZCB9IGZyb20gXCIuL2RuZC10eXBlc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIERyYWdEcm9wRGF0YSB7XG4gIGRhdGE/OmFueTtcbiAgdHlwZT86c3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERuZEV2ZW50IGV4dGVuZHMgRHJhZ0V2ZW50IHtcbiAgX2RuZFVzaW5nSGFuZGxlPzpib29sZWFuO1xuICBfZG5kRHJvcHpvbmVBY3RpdmU/OnRydWU7XG59XG5cbmV4cG9ydCB0eXBlIERuZERyYWdJbWFnZU9mZnNldEZ1bmN0aW9uID0gKCBldmVudDpEcmFnRXZlbnQsIGRyYWdJbWFnZTpFbGVtZW50ICkgPT4geyB4Om51bWJlciwgeTpudW1iZXIgfTtcblxuZXhwb3J0IGNvbnN0IERST1BfRUZGRUNUUyA9IFsgXCJtb3ZlXCIsIFwiY29weVwiLCBcImxpbmtcIiBdIGFzIERyb3BFZmZlY3RbXTtcblxuZXhwb3J0IGNvbnN0IENVU1RPTV9NSU1FX1RZUEUgPSBcImFwcGxpY2F0aW9uL3gtZG5kXCI7XG5leHBvcnQgY29uc3QgSlNPTl9NSU1FX1RZUEUgPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcbmV4cG9ydCBjb25zdCBNU0lFX01JTUVfVFlQRSA9IFwiVGV4dFwiO1xuXG5mdW5jdGlvbiBtaW1lVHlwZUlzQ3VzdG9tKCBtaW1lVHlwZTpzdHJpbmcgKSB7XG5cbiAgcmV0dXJuIG1pbWVUeXBlLnN1YnN0ciggMCwgQ1VTVE9NX01JTUVfVFlQRS5sZW5ndGggKSA9PT0gQ1VTVE9NX01JTUVfVFlQRTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdlbGxLbm93bk1pbWVUeXBlKCBldmVudDpEcmFnRXZlbnQgKTpzdHJpbmcgfCBudWxsIHtcblxuICBpZiggZXZlbnQuZGF0YVRyYW5zZmVyICkge1xuXG4gICAgY29uc3QgdHlwZXMgPSBldmVudC5kYXRhVHJhbnNmZXIudHlwZXM7XG5cbiAgICAvLyBJRSA5IHdvcmthcm91bmQuXG4gICAgaWYoICF0eXBlcyApIHtcblxuICAgICAgcmV0dXJuIE1TSUVfTUlNRV9UWVBFO1xuICAgIH1cblxuICAgIGZvciggbGV0IGkgPSAwOyBpIDwgdHlwZXMubGVuZ3RoOyBpKysgKSB7XG5cbiAgICAgIGlmKCB0eXBlc1sgaSBdID09PSBNU0lFX01JTUVfVFlQRVxuICAgICAgICB8fCB0eXBlc1sgaSBdID09PSBKU09OX01JTUVfVFlQRVxuICAgICAgICB8fCBtaW1lVHlwZUlzQ3VzdG9tKCB0eXBlc1sgaSBdICkgKSB7XG5cbiAgICAgICAgcmV0dXJuIHR5cGVzWyBpIF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXREcmFnRGF0YSggZXZlbnQ6RHJhZ0V2ZW50LCBkYXRhOkRyYWdEcm9wRGF0YSwgZWZmZWN0QWxsb3dlZDpFZmZlY3RBbGxvd2VkICk6dm9pZCB7XG5cbiAgLy8gSW50ZXJuZXQgRXhwbG9yZXIgYW5kIE1pY3Jvc29mdCBFZGdlIGRvbid0IHN1cHBvcnQgY3VzdG9tIG1pbWUgdHlwZXMsIHNlZSBkZXNpZ24gZG9jOlxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWFyY2VsanVlbmVtYW5uL2FuZ3VsYXItZHJhZy1hbmQtZHJvcC1saXN0cy93aWtpL0RhdGEtVHJhbnNmZXItRGVzaWduXG4gIGNvbnN0IG1pbWVUeXBlID0gQ1VTVE9NX01JTUVfVFlQRSArIChkYXRhLnR5cGUgPyAoXCItXCIgKyBkYXRhLnR5cGUpIDogXCJcIik7XG5cbiAgY29uc3QgZGF0YVN0cmluZyA9IEpTT04uc3RyaW5naWZ5KCBkYXRhICk7XG5cbiAgdHJ5IHtcblxuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCBtaW1lVHlwZSwgZGF0YVN0cmluZyApO1xuXG4gIH1cbiAgY2F0Y2goIGUgKSB7XG5cbiAgICAvLyAgIFNldHRpbmcgYSBjdXN0b20gTUlNRSB0eXBlIGRpZCBub3Qgd29yaywgd2UgYXJlIHByb2JhYmx5IGluIElFIG9yIEVkZ2UuXG4gICAgdHJ5IHtcblxuICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoIEpTT05fTUlNRV9UWVBFLCBkYXRhU3RyaW5nICk7XG5cbiAgICB9XG4gICAgY2F0Y2goIGUgKSB7XG5cbiAgICAgIC8vICAgV2UgYXJlIGluIEludGVybmV0IEV4cGxvcmVyIGFuZCBjYW4gb25seSB1c2UgdGhlIFRleHQgTUlNRSB0eXBlLiBBbHNvIG5vdGUgdGhhdCBJRVxuICAgICAgLy8gICBkb2VzIG5vdCBhbGxvdyBjaGFuZ2luZyB0aGUgY3Vyc29yIGluIHRoZSBkcmFnb3ZlciBldmVudCwgdGhlcmVmb3JlIHdlIGhhdmUgdG8gY2hvb3NlXG4gICAgICAvLyAgIHRoZSBvbmUgd2Ugd2FudCB0byBkaXNwbGF5IG5vdyBieSBzZXR0aW5nIGVmZmVjdEFsbG93ZWQuXG4gICAgICBjb25zdCBlZmZlY3RzQWxsb3dlZCA9IGZpbHRlckVmZmVjdHMoIERST1BfRUZGRUNUUywgZWZmZWN0QWxsb3dlZCApO1xuICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBlZmZlY3RzQWxsb3dlZFsgMCBdO1xuICAgICAgXG4gICAgICAvKlxuICAgICAgQlVHIEZJWCAtIElTU1VFOiBpbiBJRTExIHdoZW4gZHJhZ2dpbmcgaW4gYSBORVcgV29ya2Zsb3cgTm9kZSB0aGUgY2xpcGJvYXJkIGdldHMgb3ZlcndyaXR0ZW4gd2l0aCB0aGVcbiAgICAgIG5vZGUgbW9kZWwgSlNPTiBkYXRhIHdoZW4gZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoKSBiZWxvdyBpcyBjYWxsZWQuXG4gICAgICB0aGlzIGNhdXNlcyBpc3N1ZXMgd2hlbiBhIHVzZXIgaGFzIHByZXZpb3VzbHkgY29waWVkIHRleHQgdG8gdGhlIGNsaXBib2FyZCB3aXRoIHRoZSBpZGVhIG9mIHBhc3RpbmcgaXQsXG4gICAgICBhcyB0aGUgdXNlcidzIGludGVuZGVkIGRhdGEgdG8gcGFzdGUgaXMgb3ZlcndyaXR0ZW4ganVzdCBieSBkb2luZyBhbiB1bi1yZWxhdGVkIGFjdGlvbiBpZTogc2ltcGx5IGRyYWdnaW5nIGluIGEgTmV3IFdvcmtmbG93IE5vZGUuXG5cbiAgICAgIEJVRyBGSVg6IHN0b3JlIHRoZSB2YWx1ZSBvZiBjbGlwYm9hcmQgYmVmb3JlIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCkgaXMgY2FsbGVkIGFuZCB0aGVuIHJlc3RvcmUgdGhlIGRhdGEgdG8gY2xpcGJvYXJkLlxuICAgICovXG4gICAgdHJ5IHtcbiAgICAgIGlmKHdpbmRvd1snY2xpcGJvYXJkRGF0YSddICYmIHdpbmRvd1snY2xpcGJvYXJkRGF0YSddLmdldERhdGEoJ1RleHQnKSApe1xuICAgICAgICB2YXIgcHJlVHJhbnNmZXJDbGlwYm9hcmREYXRhID0gd2luZG93WydjbGlwYm9hcmREYXRhJ10uZ2V0RGF0YSgnVGV4dCcpO1xuICAgICAgfVxuICAgIH0gY2F0Y2goZSl7XG4gICAgICAvL2RvIG5vdGhpbmcganVzdCBzd2FsbG93IGFueSBjbGlwYm9hcmQgcmVsYXRlZCBlcnJvcnNcbiAgICB9XG5cbiAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCBNU0lFX01JTUVfVFlQRSwgZGF0YVN0cmluZyApO1xuICAgICAgXG4gICAgLy8gY2xpcGJvYXJkIGRhdGEgaXMgcmVzdG9yZWQgaGVyZSBhcyBwYXJ0IG9mIEJVRyBGSVggcmVmZXJlbmNlZCBhYm92ZVxuICAgIHRyeSB7XG4gICAgICAgICAgaWYod2luZG93WydjbGlwYm9hcmREYXRhJ10gJiYgcHJlVHJhbnNmZXJDbGlwYm9hcmREYXRhKXtcbiAgICAgICAgICB3aW5kb3dbJ2NsaXBib2FyZERhdGEnXS5zZXREYXRhKCdUZXh0JywgcHJlVHJhbnNmZXJDbGlwYm9hcmREYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgLy9kbyBub3RoaW5nIGp1c3Qgc3dhbGxvdyBhbnkgY2xpcGJvYXJkIHJlbGF0ZWQgZXJyb3JzXG4gICAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERyb3BEYXRhKCBldmVudDpEcmFnRXZlbnQsIGRyYWdJc0V4dGVybmFsOmJvb2xlYW4gKTpEcmFnRHJvcERhdGEge1xuXG4gIC8vIGNoZWNrIGlmIHRoZSBtaW1lIHR5cGUgaXMgd2VsbCBrbm93blxuICBjb25zdCBtaW1lVHlwZSA9IGdldFdlbGxLbm93bk1pbWVUeXBlKCBldmVudCApO1xuXG4gIC8vIGRyYWcgZGlkIG5vdCBvcmlnaW5hdGUgZnJvbSBbZG5kRHJhZ2dhYmxlXVxuICBpZiggZHJhZ0lzRXh0ZXJuYWwgPT09IHRydWUgKSB7XG5cbiAgICBpZiggbWltZVR5cGUgIT09IG51bGxcbiAgICAgICYmIG1pbWVUeXBlSXNDdXN0b20oIG1pbWVUeXBlICkgKSB7XG5cbiAgICAgIC8vIHRoZSB0eXBlIG9mIGNvbnRlbnQgaXMgd2VsbCBrbm93biBhbmQgc2FmZSB0byBoYW5kbGVcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKCBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSggbWltZVR5cGUgKSApO1xuICAgIH1cblxuICAgIC8vIHRoZSBjb250YWluZWQgZGF0YSBpcyB1bmtub3duLCBsZXQgdXNlciBoYW5kbGUgaXRcbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvLyB0aGUgdHlwZSBvZiBjb250ZW50IGlzIHdlbGwga25vd24gYW5kIHNhZmUgdG8gaGFuZGxlXG4gIHJldHVybiBKU09OLnBhcnNlKCBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSggbWltZVR5cGUgKSApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyRWZmZWN0cyggZWZmZWN0czpEcm9wRWZmZWN0W10sIGFsbG93ZWQ6RWZmZWN0QWxsb3dlZCB8IERyb3BFZmZlY3QgKTpEcm9wRWZmZWN0W10ge1xuXG4gIGlmKCBhbGxvd2VkID09PSBcImFsbFwiXG4gICAgfHwgYWxsb3dlZCA9PT0gXCJ1bmluaXRpYWxpemVkXCIgKSB7XG5cbiAgICByZXR1cm4gZWZmZWN0cztcbiAgfVxuXG4gIHJldHVybiBlZmZlY3RzLmZpbHRlciggZnVuY3Rpb24oIGVmZmVjdCApIHtcblxuICAgIHJldHVybiBhbGxvd2VkLnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggZWZmZWN0ICkgIT09IC0xO1xuICB9ICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREaXJlY3RDaGlsZEVsZW1lbnQoIHBhcmVudEVsZW1lbnQ6RWxlbWVudCwgY2hpbGRFbGVtZW50OkVsZW1lbnQgKTpFbGVtZW50IHwgbnVsbCB7XG5cbiAgbGV0IGRpcmVjdENoaWxkOk5vZGUgPSBjaGlsZEVsZW1lbnQ7XG5cbiAgd2hpbGUoIGRpcmVjdENoaWxkLnBhcmVudE5vZGUgIT09IHBhcmVudEVsZW1lbnQgKSB7XG5cbiAgICAvLyByZWFjaGVkIHJvb3Qgbm9kZSB3aXRob3V0IGZpbmRpbmcgZ2l2ZW4gcGFyZW50XG4gICAgaWYoICFkaXJlY3RDaGlsZC5wYXJlbnROb2RlICkge1xuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBkaXJlY3RDaGlsZCA9IGRpcmVjdENoaWxkLnBhcmVudE5vZGU7XG4gIH1cblxuICByZXR1cm4gZGlyZWN0Q2hpbGQgYXMgRWxlbWVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZFBvc2l0aW9uUGxhY2Vob2xkZXJCZWZvcmVFbGVtZW50KCBldmVudDpEcmFnRXZlbnQsIGVsZW1lbnQ6RWxlbWVudCwgaG9yaXpvbnRhbDpib29sZWFuICkge1xuXG4gIGNvbnN0IGJvdW5kcyA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgLy8gSWYgdGhlIHBvaW50ZXIgaXMgaW4gdGhlIHVwcGVyIGhhbGYgb2YgdGhlIGxpc3QgaXRlbSBlbGVtZW50LFxuICAvLyB3ZSBwb3NpdGlvbiB0aGUgcGxhY2Vob2xkZXIgYmVmb3JlIHRoZSBsaXN0IGl0ZW0sIG90aGVyd2lzZSBhZnRlciBpdC5cbiAgaWYoIGhvcml6b250YWwgKSB7XG5cbiAgICByZXR1cm4gKGV2ZW50LmNsaWVudFggPCBib3VuZHMubGVmdCArIGJvdW5kcy53aWR0aCAvIDIpO1xuICB9XG5cbiAgcmV0dXJuIChldmVudC5jbGllbnRZIDwgYm91bmRzLnRvcCArIGJvdW5kcy5oZWlnaHQgLyAyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGN1bGF0ZURyYWdJbWFnZU9mZnNldCggZXZlbnQ6RHJhZ0V2ZW50LCBkcmFnSW1hZ2U6RWxlbWVudCApOnsgeDpudW1iZXIsIHk6bnVtYmVyIH0ge1xuXG4gIGNvbnN0IGRyYWdJbWFnZUNvbXB1dGVkU3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggZHJhZ0ltYWdlICk7XG4gIGNvbnN0IHBhZGRpbmdUb3AgPSBwYXJzZUZsb2F0KCBkcmFnSW1hZ2VDb21wdXRlZFN0eWxlLnBhZGRpbmdUb3AgKSB8fCAwO1xuICBjb25zdCBwYWRkaW5nTGVmdCA9IHBhcnNlRmxvYXQoIGRyYWdJbWFnZUNvbXB1dGVkU3R5bGUucGFkZGluZ0xlZnQgKSB8fCAwO1xuICBjb25zdCBib3JkZXJUb3AgPSBwYXJzZUZsb2F0KCBkcmFnSW1hZ2VDb21wdXRlZFN0eWxlLmJvcmRlclRvcFdpZHRoICkgfHwgMDtcbiAgY29uc3QgYm9yZGVyTGVmdCA9IHBhcnNlRmxvYXQoIGRyYWdJbWFnZUNvbXB1dGVkU3R5bGUuYm9yZGVyTGVmdFdpZHRoICkgfHwgMDtcblxuICByZXR1cm4ge1xuICAgIHg6IGV2ZW50Lm9mZnNldFggKyBwYWRkaW5nTGVmdCArIGJvcmRlckxlZnQsXG4gICAgeTogZXZlbnQub2Zmc2V0WSArIHBhZGRpbmdUb3AgKyBib3JkZXJUb3BcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldERyYWdJbWFnZSggZXZlbnQ6RHJhZ0V2ZW50LCBkcmFnSW1hZ2U6RWxlbWVudCwgb2Zmc2V0RnVuY3Rpb246RG5kRHJhZ0ltYWdlT2Zmc2V0RnVuY3Rpb24gKTp2b2lkIHtcblxuICBjb25zdCBvZmZzZXQgPSBvZmZzZXRGdW5jdGlvbiggZXZlbnQsIGRyYWdJbWFnZSApIHx8IHt4OiAwLCB5OiAwfTtcblxuICAoZXZlbnQuZGF0YVRyYW5zZmVyIGFzIGFueSkuc2V0RHJhZ0ltYWdlKCBkcmFnSW1hZ2UsIG9mZnNldC54LCBvZmZzZXQueSApO1xufVxuIl19