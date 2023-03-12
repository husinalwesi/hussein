import Vue from 'vue'
import gsap from "gsap";
import BezierEasing from "bezier-easing";
import {dragscroll} from 'vue-dragscroll'

Vue.directive('bubbleButton', {
  bind(el, binding) {
    el.style["-webkit-tap-highlight-color"] = "transparent";
    el.addEventListener('click', (e) => {
      if (el.classList.contains("disabled-button") || el.classList.contains("bubbleAnimating")) return false;
      el.classList.add("bubbleAnimating");
      let duration = 0.33 / 2;
      gsap.to(el, {
        scale: 0.2,
        duration: duration,
        overwrite: true,
        ease: BezierEasing(0.33, 0, 0.67, 1),
        onComplete: () => {
          gsap
            .to(el, {
              scale: 1,
              duration: duration,
              overwrite: true,
              ease: BezierEasing(0.33, 0, 0.67, 1),
              onComplete: () => {
                el.classList.remove("bubbleAnimating");
              }
            });
        }
      });
    })
  }
})


Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his childrens
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        if (binding.modifiers.special) {
          if (!event.target.closest(".mx-table-month") && !event.target.closest(".mx-calendar-header-label") && !event.target.closest(".mx-table-year") && !event.target.closest(".open-drop-list") && !event.target.closest(".users-list-popup-indicator-opener")) vnode.context[binding.expression](event);
        } else {
          vnode.context[binding.expression](event);
        }
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});

Vue.directive('accept-only-number', {
  bind(el, binding, vnode) {
    el.addEventListener('keydown', (e) => {
      if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && e.ctrlKey === true) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && e.ctrlKey === true) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39) ||
        // Allow: dots
        (e.keyCode === 190 && e.shiftKey === false && e.target.value.indexOf(".") === -1 && binding.modifiers.allowDots)
      ) {
        // let it happen, don't do anything
        return
      }

      // Prevent arabic numbers.
      if(/[\u0600-\u06FF]/.test(e.key)) e.preventDefault();

      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault()
      }

      if (binding.modifiers.allowedTwoDigitAfterDot) {
        let dotSeparator = e.target.value.split(".");
        let numberAfterDot = dotSeparator[1];
        if (numberAfterDot !== undefined) {
          if (numberAfterDot.toString().length > 1) {
            e.preventDefault();
          }
        }
      }

    })
  }
})

Vue.directive('dragscroll', dragscroll)

