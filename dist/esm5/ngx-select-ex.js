import * as escapeStringNs from 'escape-string-regexp';
import { Directive, TemplateRef, Input, Output, ViewChild, Component, EventEmitter, forwardRef, HostListener, IterableDiffers, ChangeDetectorRef, ContentChild, Optional, Inject, InjectionToken, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import * as lodashNs from 'lodash';
import { CommonModule } from '@angular/common';

var escapeString = escapeStringNs;
var NgxSelectOption = /** @class */ (function () {
    function NgxSelectOption(value, text, disabled, data, _parent) {
        if (_parent === void 0) { _parent = null; }
        this.value = value;
        this.text = text;
        this.disabled = disabled;
        this.data = data;
        this._parent = _parent;
        this.type = 'option';
        this.cacheRenderedText = null;
    }
    Object.defineProperty(NgxSelectOption.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    NgxSelectOption.prototype.renderText = function (sanitizer, highlightText) {
        if (this.cacheHighlightText !== highlightText || this.cacheRenderedText === null) {
            this.cacheHighlightText = highlightText;
            if (this.cacheHighlightText) {
                this.cacheRenderedText = sanitizer.bypassSecurityTrustHtml((this.text + '').replace(new RegExp(escapeString(this.cacheHighlightText), 'gi'), '<strong>$&</strong>'));
            }
            else {
                this.cacheRenderedText = sanitizer.bypassSecurityTrustHtml(this.text);
            }
        }
        return this.cacheRenderedText;
    };
    return NgxSelectOption;
}());
var NgxSelectOptGroup = /** @class */ (function () {
    function NgxSelectOptGroup(label, options) {
        if (options === void 0) { options = []; }
        this.label = label;
        this.options = options;
        this.type = 'optgroup';
        this.filter(function () { return true; });
    }
    NgxSelectOptGroup.prototype.filter = function (callbackFn) {
        this.optionsFiltered = this.options.filter(function (option) { return callbackFn(option); });
    };
    return NgxSelectOptGroup;
}());
var NgxSelectOptionDirective = /** @class */ (function () {
    function NgxSelectOptionDirective(template) {
        this.template = template;
    }
    return NgxSelectOptionDirective;
}());
NgxSelectOptionDirective.decorators = [
    { type: Directive, args: [{ selector: '[ngx-select-option]' },] },
];
NgxSelectOptionDirective.ctorParameters = function () { return [
    { type: TemplateRef, },
]; };
var NgxSelectOptionSelectedDirective = /** @class */ (function () {
    function NgxSelectOptionSelectedDirective(template) {
        this.template = template;
    }
    return NgxSelectOptionSelectedDirective;
}());
NgxSelectOptionSelectedDirective.decorators = [
    { type: Directive, args: [{ selector: '[ngx-select-option-selected]' },] },
];
NgxSelectOptionSelectedDirective.ctorParameters = function () { return [
    { type: TemplateRef, },
]; };
var NgxSelectOptionNotFoundDirective = /** @class */ (function () {
    function NgxSelectOptionNotFoundDirective(template) {
        this.template = template;
    }
    return NgxSelectOptionNotFoundDirective;
}());
NgxSelectOptionNotFoundDirective.decorators = [
    { type: Directive, args: [{ selector: '[ngx-select-option-not-found]' },] },
];
NgxSelectOptionNotFoundDirective.ctorParameters = function () { return [
    { type: TemplateRef, },
]; };
var _ = lodashNs;
var escapeString$1 = escapeStringNs;
var NGX_SELECT_OPTIONS = new InjectionToken('NGX_SELECT_OPTIONS');
var ENavigation = {
    first: 0,
    previous: 1,
    next: 2,
    last: 3,
    firstSelected: 4,
    firstIfOptionActiveInvisible: 5,
};
ENavigation[ENavigation.first] = "first";
ENavigation[ENavigation.previous] = "previous";
ENavigation[ENavigation.next] = "next";
ENavigation[ENavigation.last] = "last";
ENavigation[ENavigation.firstSelected] = "firstSelected";
ENavigation[ENavigation.firstIfOptionActiveInvisible] = "firstIfOptionActiveInvisible";
function propertyExists(obj, propertyName) {
    return propertyName in obj;
}
var NgxSelectComponent = /** @class */ (function () {
    function NgxSelectComponent(iterableDiffers, sanitizer, cd, defaultOptions) {
        var _this = this;
        this.sanitizer = sanitizer;
        this.cd = cd;
        this.optionValueField = 'id';
        this.optionTextField = 'text';
        this.optGroupLabelField = 'label';
        this.optGroupOptionsField = 'options';
        this.multiple = false;
        this.allowClear = false;
        this.placeholder = '';
        this.noAutoComplete = false;
        this.disabled = false;
        this.defaultValue = [];
        this.autoSelectSingleOption = false;
        this.autoClearSearch = false;
        this.noResultsFound = 'No results found';
        this.size = 'default';
        this.keyCodeToRemoveSelected = 'Delete';
        this.keyCodeToOptionsOpen = 'Enter';
        this.keyCodeToOptionsClose = 'Escape';
        this.keyCodeToOptionsSelect = 'Enter';
        this.keyCodeToNavigateFirst = 'ArrowLeft';
        this.keyCodeToNavigatePrevious = 'ArrowUp';
        this.keyCodeToNavigateNext = 'ArrowDown';
        this.keyCodeToNavigateLast = 'ArrowRight';
        this.typed = new EventEmitter();
        this.focus = new EventEmitter();
        this.blur = new EventEmitter();
        this.open = new EventEmitter();
        this.close = new EventEmitter();
        this.select = new EventEmitter();
        this.remove = new EventEmitter();
        this.navigated = new EventEmitter();
        this.selectionChanges = new EventEmitter();
        this.optionsOpened = false;
        this.actualValue = [];
        this.subjOptions = new BehaviorSubject([]);
        this.subjSearchText = new BehaviorSubject('');
        this.subjOptionsSelected = new BehaviorSubject([]);
        this.subjExternalValue = new BehaviorSubject([]);
        this.subjDefaultValue = new BehaviorSubject([]);
        this.subjRegisterOnChange = new Subject();
        this._focusToInput = false;
        this.isFocused = false;
        this.onChange = function (v) { return v; };
        this.onTouched = function () { return null; };
        Object.assign(this, defaultOptions);
        this.itemsDiffer = iterableDiffers.find([]).create(null);
        this.defaultValueDiffer = iterableDiffers.find([]).create(null);
        this.typed.subscribe(function (text) { return _this.subjSearchText.next(text); });
        this.subjOptionsSelected.subscribe(function (options) { return _this.selectionChanges.emit(options); });
        var cacheExternalValue;
        var subjActualValue = this.subjExternalValue
            .map(function (v) { return cacheExternalValue = v === null ? [] : [].concat(v); })
            .merge(this.subjOptionsSelected.map(function (options) { return options.map(function (o) { return o.value; }); }))
            .combineLatest(this.subjDefaultValue, function (eVal, dVal) {
            var newVal = _.isEqual(eVal, dVal) ? [] : eVal;
            return newVal.length ? newVal : dVal;
        })
            .distinctUntilChanged(function (x, y) { return _.isEqual(x, y); })
            .share();
        subjActualValue
            .combineLatest(this.subjRegisterOnChange, function (actualValue) { return actualValue; })
            .subscribe(function (actualValue) {
            _this.actualValue = actualValue;
            if (!_.isEqual(actualValue, cacheExternalValue)) {
                cacheExternalValue = actualValue;
                if (_this.multiple) {
                    _this.onChange(actualValue);
                }
                else {
                    _this.onChange(actualValue.length ? actualValue[0] : null);
                }
            }
        });
        this.subjOptions
            .flatMap(function (options) { return Observable
            .from(options)
            .flatMap(function (option) { return option instanceof NgxSelectOption
            ? Observable.of(option)
            : (option instanceof NgxSelectOptGroup ? Observable.from(option.options) : Observable.empty()); })
            .toArray(); })
            .combineLatest(subjActualValue, function (optionsFlat, actualValue) {
            Observable.from(optionsFlat)
                .filter(function (option) { return actualValue.indexOf(option.value) !== -1; })
                .toArray()
                .filter(function (options) { return !_.isEqual(options, _this.subjOptionsSelected.value); })
                .subscribe(function (options) { return _this.subjOptionsSelected.next(options); });
        })
            .subscribe();
        this.subjOptions
            .combineLatest(this.subjOptionsSelected, this.subjSearchText, function (options, selectedOptions, search) {
            _this.optionsFiltered = _this.filterOptions(search, options, selectedOptions);
            _this.cacheOptionsFilteredFlat = null;
            _this.navigateOption(ENavigation.firstIfOptionActiveInvisible);
            return selectedOptions;
        })
            .flatMap(function (selectedOptions) {
            return _this.optionsFilteredFlat().filter(function (flatOptions) { return _this.autoSelectSingleOption && flatOptions.length === 1 && !selectedOptions.length; });
        })
            .subscribe(function (flatOptions) { return _this.subjOptionsSelected.next(flatOptions); });
    }
    Object.defineProperty(NgxSelectComponent.prototype, "inputText", {
        get: function () {
            if (this.inputElRef && this.inputElRef.nativeElement) {
                return this.inputElRef.nativeElement.value;
            }
            return '';
        },
        enumerable: true,
        configurable: true
    });
    NgxSelectComponent.prototype.setFormControlSize = function (otherClassNames, useFormControl) {
        if (otherClassNames === void 0) { otherClassNames = {}; }
        if (useFormControl === void 0) { useFormControl = true; }
        var formControlExtraClasses = useFormControl ? {
            'form-control-sm input-sm': this.size === 'small',
            'form-control-lg input-lg': this.size === 'large'
        } : {};
        return Object.assign(formControlExtraClasses, otherClassNames);
    };
    NgxSelectComponent.prototype.setBtnSize = function () {
        return { 'btn-sm': this.size === 'small', 'btn-lg': this.size === 'large' };
    };
    Object.defineProperty(NgxSelectComponent.prototype, "optionsSelected", {
        get: function () {
            return this.subjOptionsSelected.value;
        },
        enumerable: true,
        configurable: true
    });
    NgxSelectComponent.prototype.mainClicked = function (event) {
        event.clickedSelectComponent = this;
        if (!this.isFocused) {
            this.isFocused = true;
            this.focus.emit();
        }
    };
    NgxSelectComponent.prototype.documentClick = function (event) {
        if (event.clickedSelectComponent !== this) {
            if (this.optionsOpened) {
                this.optionsClose();
                this.cd.detectChanges();
            }
            if (this.isFocused) {
                this.isFocused = false;
                this.blur.emit();
            }
        }
    };
    NgxSelectComponent.prototype.optionsFilteredFlat = function () {
        var _this = this;
        if (this.cacheOptionsFilteredFlat) {
            return Observable.of(this.cacheOptionsFilteredFlat);
        }
        return Observable.from(this.optionsFiltered)
            .flatMap(function (option) { return option instanceof NgxSelectOption ? Observable.of(option) :
            (option instanceof NgxSelectOptGroup ? Observable.from(option.optionsFiltered) : Observable.empty()); })
            .filter(function (optionsFilteredFlat) { return !optionsFilteredFlat.disabled; })
            .toArray()
            .do(function (optionsFilteredFlat) { return _this.cacheOptionsFilteredFlat = optionsFilteredFlat; });
    };
    NgxSelectComponent.prototype.navigateOption = function (navigation) {
        var _this = this;
        this.optionsFilteredFlat()
            .map(function (options) {
            var navigated = { index: -1, activeOption: null, filteredOptionList: options };
            var newActiveIdx;
            switch (navigation) {
                case ENavigation.first:
                    navigated.index = 0;
                    break;
                case ENavigation.previous:
                    newActiveIdx = options.indexOf(_this.optionActive) - 1;
                    navigated.index = newActiveIdx >= 0 ? newActiveIdx : options.length - 1;
                    break;
                case ENavigation.next:
                    newActiveIdx = options.indexOf(_this.optionActive) + 1;
                    navigated.index = newActiveIdx < options.length ? newActiveIdx : 0;
                    break;
                case ENavigation.last:
                    navigated.index = options.length - 1;
                    break;
                case ENavigation.firstSelected:
                    if (_this.subjOptionsSelected.value.length) {
                        navigated.index = options.indexOf(_this.subjOptionsSelected.value[0]);
                    }
                    break;
                case ENavigation.firstIfOptionActiveInvisible:
                    var idxOfOptionActive = options.indexOf(_this.optionActive);
                    navigated.index = idxOfOptionActive > 0 ? idxOfOptionActive : 0;
                    break;
            }
            navigated.activeOption = options[navigated.index];
            return navigated;
        })
            .subscribe(function (newNavigated) { return _this.optionActivate(newNavigated); });
    };
    NgxSelectComponent.prototype.ngDoCheck = function () {
        if (this.itemsDiffer.diff(this.items)) {
            this.subjOptions.next(this.buildOptions(this.items));
        }
        var defVal = this.defaultValue ? [].concat(this.defaultValue) : [];
        if (this.defaultValueDiffer.diff(defVal)) {
            this.subjDefaultValue.next(defVal);
        }
    };
    NgxSelectComponent.prototype.ngAfterContentChecked = function () {
        if (this._focusToInput && this.checkInputVisibility() && this.inputElRef &&
            this.inputElRef.nativeElement !== document.activeElement) {
            this._focusToInput = false;
            this.inputElRef.nativeElement.focus();
        }
    };
    NgxSelectComponent.prototype.canClearNotMultiple = function () {
        return this.allowClear && !!this.subjOptionsSelected.value.length &&
            (!this.subjDefaultValue.value.length || this.subjDefaultValue.value[0] !== this.actualValue[0]);
    };
    NgxSelectComponent.prototype.focusToInput = function () {
        this._focusToInput = true;
    };
    NgxSelectComponent.prototype.inputKeyDown = function (event) {
        var keysForOpenedState = [
            this.keyCodeToOptionsSelect,
            this.keyCodeToNavigateFirst,
            this.keyCodeToNavigatePrevious,
            this.keyCodeToNavigateNext,
            this.keyCodeToNavigateLast,
        ];
        var keysForClosedState = [this.keyCodeToOptionsOpen, this.keyCodeToRemoveSelected];
        if (this.optionsOpened && keysForOpenedState.indexOf(event.code) !== -1) {
            event.preventDefault();
            event.stopPropagation();
            switch (event.code) {
                case this.keyCodeToOptionsSelect:
                    this.optionSelect(this.optionActive);
                    this.navigateOption(ENavigation.next);
                    break;
                case this.keyCodeToNavigateFirst:
                    this.navigateOption(ENavigation.first);
                    break;
                case this.keyCodeToNavigatePrevious:
                    this.navigateOption(ENavigation.previous);
                    break;
                case this.keyCodeToNavigateLast:
                    this.navigateOption(ENavigation.last);
                    break;
                case this.keyCodeToNavigateNext:
                    this.navigateOption(ENavigation.next);
                    break;
            }
        }
        else if (!this.optionsOpened && keysForClosedState.indexOf(event.code) !== -1) {
            event.preventDefault();
            event.stopPropagation();
            switch (event.code) {
                case this.keyCodeToOptionsOpen:
                    this.optionsOpen();
                    break;
                case this.keyCodeToRemoveSelected:
                    this.optionRemove(this.subjOptionsSelected.value[this.subjOptionsSelected.value.length - 1], event);
                    break;
            }
        }
    };
    NgxSelectComponent.prototype.mainKeyUp = function (event) {
        if (event.code === this.keyCodeToOptionsClose) {
            this.optionsClose();
        }
    };
    NgxSelectComponent.prototype.trackByOption = function (index, option) {
        return option instanceof NgxSelectOption ? option.value :
            (option instanceof NgxSelectOptGroup ? option.label : option);
    };
    NgxSelectComponent.prototype.checkInputVisibility = function () {
        return (this.multiple === true) || (this.optionsOpened && !this.noAutoComplete);
    };
    NgxSelectComponent.prototype.inputKeyUp = function (value) {
        if (value === void 0) { value = ''; }
        if (!this.optionsOpened && value) {
            this.optionsOpen(value);
        }
    };
    NgxSelectComponent.prototype.doInputText = function (value) {
        if (this.optionsOpened) {
            this.typed.emit(value);
        }
    };
    NgxSelectComponent.prototype.inputClick = function (value) {
        if (value === void 0) { value = ''; }
        if (!this.optionsOpened) {
            this.optionsOpen(value);
        }
    };
    NgxSelectComponent.prototype.sanitize = function (html) {
        return html ? this.sanitizer.bypassSecurityTrustHtml(html) : null;
    };
    NgxSelectComponent.prototype.highlightOption = function (option) {
        if (this.inputElRef) {
            return option.renderText(this.sanitizer, this.inputElRef.nativeElement.value);
        }
        return option.renderText(this.sanitizer, '');
    };
    NgxSelectComponent.prototype.optionSelect = function (option, event) {
        if (event === void 0) { event = null; }
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (option && !option.disabled) {
            this.subjOptionsSelected.next((this.multiple ? this.subjOptionsSelected.value : []).concat([option]));
            this.select.emit(option.value);
            this.optionsClose();
            this.onTouched();
        }
    };
    NgxSelectComponent.prototype.optionRemove = function (option, event) {
        if (!this.disabled && option) {
            event.stopPropagation();
            this.subjOptionsSelected.next((this.multiple ? this.subjOptionsSelected.value : []).filter(function (o) { return o !== option; }));
            this.remove.emit(option.value);
        }
    };
    NgxSelectComponent.prototype.isOptionActive = function (option, element) {
        if (this.optionActive === option) {
            this.ensureVisibleElement(element);
            return true;
        }
        return false;
    };
    NgxSelectComponent.prototype.optionActivate = function (navigated) {
        if ((this.optionActive !== navigated.activeOption) &&
            (!navigated.activeOption || !navigated.activeOption.disabled)) {
            this.optionActive = navigated.activeOption;
            this.navigated.emit(navigated);
        }
    };
    NgxSelectComponent.prototype.filterOptions = function (search, options, selectedOptions) {
        var _this = this;
        var regExp = new RegExp(escapeString$1(search), 'i'), filterOption = function (option) {
            if (_this.searchCallback) {
                return _this.searchCallback(search, option);
            }
            return (!search || regExp.test(option.text)) && (!_this.multiple || selectedOptions.indexOf(option) === -1);
        };
        return options.filter(function (option) {
            if (option instanceof NgxSelectOption) {
                return filterOption((option));
            }
            else if (option instanceof NgxSelectOptGroup) {
                var subOp = (option);
                subOp.filter(function (subOption) { return filterOption(subOption); });
                return subOp.optionsFiltered.length;
            }
        });
    };
    NgxSelectComponent.prototype.ensureVisibleElement = function (element) {
        if (this.choiceMenuElRef && this.cacheElementOffsetTop !== element.offsetTop) {
            this.cacheElementOffsetTop = element.offsetTop;
            var container = this.choiceMenuElRef.nativeElement;
            if (this.cacheElementOffsetTop < container.scrollTop) {
                container.scrollTop = this.cacheElementOffsetTop;
            }
            else if (this.cacheElementOffsetTop + element.offsetHeight > container.scrollTop + container.clientHeight) {
                container.scrollTop = this.cacheElementOffsetTop + element.offsetHeight - container.clientHeight;
            }
        }
    };
    NgxSelectComponent.prototype.optionsOpen = function (search) {
        if (search === void 0) { search = ''; }
        if (!this.disabled) {
            this.optionsOpened = true;
            this.subjSearchText.next(search);
            if (!this.multiple && this.subjOptionsSelected.value.length) {
                this.navigateOption(ENavigation.firstSelected);
            }
            else {
                this.navigateOption(ENavigation.first);
            }
            this.focusToInput();
            this.open.emit();
        }
    };
    NgxSelectComponent.prototype.optionsClose = function () {
        this.optionsOpened = false;
        this.close.emit();
        if (this.autoClearSearch && this.multiple && this.inputElRef) {
            this.inputElRef.nativeElement.value = null;
        }
    };
    NgxSelectComponent.prototype.buildOptions = function (data) {
        var _this = this;
        var result = [];
        if (Array.isArray(data)) {
            var option_1;
            data.forEach(function (item) {
                var isOptGroup = typeof item === 'object' && item !== null &&
                    propertyExists(item, _this.optGroupLabelField) && propertyExists(item, _this.optGroupOptionsField) &&
                    Array.isArray(item[_this.optGroupOptionsField]);
                if (isOptGroup) {
                    var optGroup_1 = new NgxSelectOptGroup(item[_this.optGroupLabelField]);
                    item[_this.optGroupOptionsField].forEach(function (subOption) {
                        if (option_1 = _this.buildOption(subOption, optGroup_1)) {
                            optGroup_1.options.push(option_1);
                        }
                    });
                    result.push(optGroup_1);
                }
                else if (option_1 = _this.buildOption(item, null)) {
                    result.push(option_1);
                }
            });
        }
        return result;
    };
    NgxSelectComponent.prototype.buildOption = function (data, parent) {
        var value, text, disabled;
        if (typeof data === 'string' || typeof data === 'number') {
            value = text = data;
            disabled = false;
        }
        else if (typeof data === 'object' && data !== null &&
            (propertyExists(data, this.optionValueField) || propertyExists(data, this.optionTextField))) {
            value = propertyExists(data, this.optionValueField) ? data[this.optionValueField] : data[this.optionTextField];
            text = propertyExists(data, this.optionTextField) ? data[this.optionTextField] : data[this.optionValueField];
            disabled = propertyExists(data, 'disabled') ? data['disabled'] : false;
        }
        else {
            return null;
        }
        return new NgxSelectOption(value, text, disabled, data, parent);
    };
    NgxSelectComponent.prototype.writeValue = function (obj) {
        this.subjExternalValue.next(obj);
    };
    NgxSelectComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
        this.subjRegisterOnChange.next();
    };
    NgxSelectComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    NgxSelectComponent.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    return NgxSelectComponent;
}());
NgxSelectComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-select',
                template: "<div #main [tabindex]=\"disabled? -1: 0\" class=\"ngx-select dropdown\"\n     [ngClass]=\"setFormControlSize({\n        'ngx-select_multiple form-control': multiple === true,\n        'open show': optionsOpened && optionsFiltered.length\n     }, multiple === true)\"\n     (click)=\"mainClicked($event)\" (focusin)=\"mainClicked($event)\"\n     (focus)=\"focusToInput()\" (keydown)=\"inputKeyDown($event)\"\n     (keyup)=\"mainKeyUp($event)\">\n    <div [ngClass]=\"{ 'ngx-select__disabled': disabled}\"></div>\n\n    <!-- single selected item -->\n    <div class=\"ngx-select__selected\"\n         *ngIf=\"(multiple === false) && (!optionsOpened || noAutoComplete)\">\n        <div class=\"ngx-select__toggle btn form-control\" [ngClass]=\"setFormControlSize(setBtnSize())\"\n             (click)=\"optionsOpen()\">\n\n            <span *ngIf=\"!optionsSelected.length\" class=\"ngx-select__placeholder text-muted\">\n                <span [innerHtml]=\"placeholder\"></span>\n            </span>\n            <span *ngIf=\"optionsSelected.length\"\n                  class=\"ngx-select__selected-single pull-left float-left\"\n                  [ngClass]=\"{'ngx-select__allow-clear': allowClear}\">\n                <ng-container [ngTemplateOutlet]=\"templateSelectedOption || defaultTemplateOption\"\n                              [ngTemplateOutletContext]=\"{$implicit: optionsSelected[0], index: 0,\n                                                          text: sanitize(optionsSelected[0].text)}\">\n                </ng-container>\n            </span>\n            <span class=\"ngx-select__toggle-buttons\">\n                <a class=\"ngx-select__clear btn btn-sm btn-link\" *ngIf=\"canClearNotMultiple()\"\n                   [ngClass]=\"setBtnSize()\"\n                   (click)=\"optionRemove(optionsSelected[0], $event)\">\n                    <i class=\"ngx-select__clear-icon\"></i>\n                </a>\n                <i class=\"dropdown-toggle\"></i>\n                <i class=\"ngx-select__toggle-caret caret\"></i>\n            </span>\n        </div>\n    </div>\n\n    <!-- multiple selected items -->\n    <div class=\"ngx-select__selected\" *ngIf=\"multiple === true\">\n        <span *ngFor=\"let option of optionsSelected; trackBy: trackByOption; let idx = index\">\n            <span tabindex=\"-1\" [ngClass]=\"setBtnSize()\"\n                  class=\"ngx-select__selected-plural btn btn-default btn-secondary btn-xs\">\n\n                <ng-container [ngTemplateOutlet]=\"templateSelectedOption || defaultTemplateOption\"\n                              [ngTemplateOutletContext]=\"{$implicit: option, index: idx, text: sanitize(option.text)}\">\n                </ng-container>\n\n                <a class=\"ngx-select__clear btn btn-sm btn-link pull-right float-right\" [ngClass]=\"setBtnSize()\"\n                   (click)=\"optionRemove(option, $event)\">\n                    <i class=\"ngx-select__clear-icon\"></i>\n                </a>\n            </span>\n        </span>\n    </div>\n\n    <!-- live search an item from the list -->\n    <input #input type=\"text\" class=\"ngx-select__search form-control\" [ngClass]=\"setFormControlSize()\"\n           *ngIf=\"checkInputVisibility()\"\n           [tabindex]=\"multiple === false? -1: 0\"\n           (keydown)=\"inputKeyDown($event)\"\n           (keyup)=\"inputKeyUp(input.value)\"\n           (input)=\"doInputText(input.value)\"\n           [disabled]=\"disabled\"\n           [placeholder]=\"optionsSelected.length? '': placeholder\"\n           (click)=\"inputClick(input.value)\"\n           autocomplete=\"off\"\n           autocorrect=\"off\"\n           autocapitalize=\"off\"\n           spellcheck=\"false\"\n           role=\"combobox\">\n\n    <!-- options template -->\n    <ul #choiceMenu role=\"menu\" *ngIf=\"isFocused\" class=\"ngx-select__choices dropdown-menu\"\n        [class.show]=\"optionsOpened\">\n        <li class=\"ngx-select__item-group\" role=\"menuitem\"\n            *ngFor=\"let opt of optionsFiltered; trackBy: trackByOption; let idxGroup=index\">\n            <div class=\"divider dropdown-divider\" *ngIf=\"opt.type === 'optgroup' && (idxGroup > 0)\"></div>\n            <div class=\"dropdown-header\" *ngIf=\"opt.type === 'optgroup'\">{{opt.label}}</div>\n\n            <a href=\"#\" #choiceItem class=\"ngx-select__item dropdown-item\"\n               *ngFor=\"let option of (opt.optionsFiltered || [opt]); trackBy: trackByOption; let idxOption = index\"\n               [ngClass]=\"{\n                    'ngx-select__item_active active': isOptionActive(option, choiceItem),\n                    'ngx-select__item_disabled disabled': option.disabled\n               }\"\n               (mouseenter)=\"optionActivate({\n                    activeOption: option,\n                    filteredOptionList: optionsFiltered,\n                    index: optionsFiltered.indexOf(option)\n               })\"\n               (click)=\"optionSelect(option, $event)\">\n                <ng-container [ngTemplateOutlet]=\"templateOption || defaultTemplateOption\"\n                              [ngTemplateOutletContext]=\"{$implicit: option, text: highlightOption(option),\n                              index: idxGroup, subIndex: idxOption}\"></ng-container>\n            </a>\n        </li>\n        <li class=\"ngx-select__item ngx-select__item_no-found dropdown-header\" *ngIf=\"!optionsFiltered.length\">\n            <ng-container [ngTemplateOutlet]=\"templateOptionNotFound || defaultTemplateOptionNotFound\"\n                          [ngTemplateOutletContext]=\"{$implicit: inputText}\"></ng-container>\n        </li>\n    </ul>\n\n    <!--Default templates-->\n    <ng-template #defaultTemplateOption let-text=\"text\">\n        <span [innerHtml]=\"text\"></span>\n    </ng-template>\n\n    <ng-template #defaultTemplateOptionNotFound>\n        {{noResultsFound}}\n    </ng-template>\n\n</div>\n",
                styles: [".ngx-select_multiple{height:auto;padding:3px 3px 0}.ngx-select_multiple .ngx-select__search{background-color:transparent!important;border:none;outline:0;-webkit-box-shadow:none;box-shadow:none;height:1.6666em;padding:0;margin-bottom:3px}.ngx-select__disabled{background-color:#eceeef;border-radius:4px;position:absolute;width:100%;height:100%;z-index:5;opacity:.6;top:0;left:0;cursor:not-allowed}.ngx-select__toggle{outline:0;position:relative;text-align:left!important;color:#333;background-color:#fff;border-color:#ccc;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.ngx-select__toggle:hover{color:#333;background-color:#e6e6e6;border-color:#adadad}.ngx-select__toggle-buttons{-ms-flex-negative:0;flex-shrink:0;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.ngx-select__toggle-caret{position:absolute;height:10px;top:50%;right:10px;margin-top:-2px}.ngx-select__placeholder{float:left}.ngx-select__clear{margin-right:10px;padding:0;border:none}.ngx-select_multiple .ngx-select__clear{line-height:initial;margin-left:5px;margin-right:0;color:#000;opacity:.5}.ngx-select__clear-icon{display:inline-block;font-size:inherit;cursor:pointer;position:relative;width:1em;height:.75em;padding:0}.ngx-select__clear-icon:after,.ngx-select__clear-icon:before{content:'';position:absolute;border-top:3px solid;width:100%;top:50%;left:0;margin-top:-1px}.ngx-select__clear-icon:before{-webkit-transform:rotate(45deg);transform:rotate(45deg)}.ngx-select__clear-icon:after{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.ngx-select__choices{width:100%;height:auto;max-height:200px;overflow-x:hidden;margin-top:0;position:absolute}.ngx-select_multiple .ngx-select__choices{margin-top:1px}.ngx-select__item{display:block;padding:3px 20px;clear:both;font-weight:400;line-height:1.42857143;white-space:nowrap;cursor:pointer;text-decoration:none}.ngx-select__item_disabled,.ngx-select__item_no-found{cursor:default}.ngx-select__item_active{color:#fff;outline:0;background-color:#428bca}.ngx-select__selected-plural,.ngx-select__selected-single{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;overflow:hidden}.ngx-select__selected-plural span,.ngx-select__selected-single span{overflow:hidden;text-overflow:ellipsis}.ngx-select__selected-plural{outline:0;margin:0 3px 3px 0}.input-group>.dropdown{position:static}"],
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(function () { return NgxSelectComponent; }),
                        multi: true
                    }
                ]
            },] },
];
NgxSelectComponent.ctorParameters = function () { return [
    { type: IterableDiffers, },
    { type: DomSanitizer, },
    { type: ChangeDetectorRef, },
    { type: undefined, decorators: [{ type: Inject, args: [NGX_SELECT_OPTIONS,] }, { type: Optional },] },
]; };
NgxSelectComponent.propDecorators = {
    "items": [{ type: Input },],
    "optionValueField": [{ type: Input },],
    "optionTextField": [{ type: Input },],
    "optGroupLabelField": [{ type: Input },],
    "optGroupOptionsField": [{ type: Input },],
    "multiple": [{ type: Input },],
    "allowClear": [{ type: Input },],
    "placeholder": [{ type: Input },],
    "noAutoComplete": [{ type: Input },],
    "disabled": [{ type: Input },],
    "defaultValue": [{ type: Input },],
    "autoSelectSingleOption": [{ type: Input },],
    "autoClearSearch": [{ type: Input },],
    "noResultsFound": [{ type: Input },],
    "size": [{ type: Input },],
    "searchCallback": [{ type: Input },],
    "typed": [{ type: Output },],
    "focus": [{ type: Output },],
    "blur": [{ type: Output },],
    "open": [{ type: Output },],
    "close": [{ type: Output },],
    "select": [{ type: Output },],
    "remove": [{ type: Output },],
    "navigated": [{ type: Output },],
    "selectionChanges": [{ type: Output },],
    "mainElRef": [{ type: ViewChild, args: ['main',] },],
    "inputElRef": [{ type: ViewChild, args: ['input',] },],
    "choiceMenuElRef": [{ type: ViewChild, args: ['choiceMenu',] },],
    "templateOption": [{ type: ContentChild, args: [NgxSelectOptionDirective, { read: TemplateRef },] },],
    "templateSelectedOption": [{ type: ContentChild, args: [NgxSelectOptionSelectedDirective, { read: TemplateRef },] },],
    "templateOptionNotFound": [{ type: ContentChild, args: [NgxSelectOptionNotFoundDirective, { read: TemplateRef },] },],
    "documentClick": [{ type: HostListener, args: ['document:focusin', ['$event'],] }, { type: HostListener, args: ['document:click', ['$event'],] },],
};
var NgxSelectModule = /** @class */ (function () {
    function NgxSelectModule() {
    }
    NgxSelectModule.forRoot = function (options) {
        return {
            ngModule: NgxSelectModule,
            providers: [{ provide: NGX_SELECT_OPTIONS, useValue: options }]
        };
    };
    return NgxSelectModule;
}());
NgxSelectModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [NgxSelectComponent,
                    NgxSelectOptionDirective, NgxSelectOptionSelectedDirective, NgxSelectOptionNotFoundDirective
                ],
                exports: [NgxSelectComponent,
                    NgxSelectOptionDirective, NgxSelectOptionSelectedDirective, NgxSelectOptionNotFoundDirective
                ]
            },] },
];

export { NgxSelectModule, NGX_SELECT_OPTIONS, NgxSelectComponent, NgxSelectOption, NgxSelectOptGroup, NgxSelectOptionDirective, NgxSelectOptionSelectedDirective, NgxSelectOptionNotFoundDirective };
//# sourceMappingURL=ngx-select-ex.js.map
