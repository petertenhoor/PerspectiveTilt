/**
 * Class Tilt
 */
class Tilt {
    /**
     * Tilt Constructor
     *
     * @param $element {HTMLElement}
     */
    constructor($element) {

        if (!typeof $element === HTMLElement) {
            throw new Error($element + ' is not a valid HTML Element')
        }

        this.width             = null
        this.height            = null
        this.left              = null
        this.top               = null
        this.transitionTimeout = null
        this.updateCall        = null

        this.settings = {
            reverse:     false,
            max:         6,
            perspective: 1000,
            easing:      "cubic-bezier(0.03, 0.98, 0.52, 0.99",
            scale:       "0.96",
            speed:       "1000",
            transition:  true,
            axis:        null,
            reset:       true
        }

        this.reverse = this.settings.reverse ? -1 : 1

        this.updateBind = this.update.bind(this)
        this.resetBind  = this.reset.bind(this)

        this.$element = $element

        this.onMouseEnterBind = this.onMouseEnter.bind(this)
        this.onMouseMoveBind  = this.onMouseMove.bind(this)
        this.onMouseLeaveBind = this.onMouseLeave.bind(this)

        this.setEventListeners()
    }

    /**
     * Set event listeners
     */
    setEventListeners() {
        this.$element.addEventListener("mouseenter", this.onMouseEnterBind)
        this.$element.addEventListener("mousemove", this.onMouseMoveBind)
        this.$element.addEventListener("mouseleave", this.onMouseLeaveBind)
    }

    /**
     * Handle mouse enter
     *
     * @param event
     */
    onMouseEnter(event) {
        this.updateElementPosition()
        this.$element.style.willChange = "transform"
        this.setTransition()
    }

    /**
     * Handle mouse move
     *
     * @param event
     */
    onMouseMove(event) {
        if (this.updateCall !== null) {
            cancelAnimationFrame(this.updateCall)
        }

        this.event      = event
        this.updateCall = requestAnimationFrame(this.updateBind)
    }

    /**
     * Handle mouse leave
     */
    onMouseLeave() {
        this.setTransition()
        requestAnimationFrame(this.resetBind)
    }

    /**
     * Get needed values
     *
     * @returns {{tiltX: string, tiltY: string, percentageX: number, percentageY: number, angle: number}}
     */
    getValues() {
        let x = (this.event.clientX - this.left) / this.width
        let y = (this.event.clientY - this.top) / this.height

        x = Math.min(Math.max(x, 0), 1)
        y = Math.min(Math.max(y, 0), 1)

        let tiltX = (this.reverse * (this.settings.max / 2 - x * this.settings.max)).toFixed(2)
        let tiltY = (this.reverse * (y * this.settings.max - this.settings.max / 2)).toFixed(2)

        return {
            tiltX:       tiltX,
            tiltY:       tiltY,
            percentageX: x * 100,
            percentageY: y * 100
        }
    }

    /**
     * Set transition
     */
    setTransition() {
        clearTimeout(this.transitionTimeout)
        this.$element.style.transition = this.settings.speed + "ms " + this.settings.easing

        this.transitionTimeout = setTimeout(() => {
            this.$element.style.transition = ""
        }, this.settings.speed)
    }

    /**
     * Reset tilt animation
     */
    reset() {
        this.event = {
            pageX: this.left + this.width / 2,
            pageY: this.top + this.height / 2
        }

        this.$element.style.transform = "perspective(" + this.settings.perspective + "px) " +
            "rotateX(0deg) " +
            "rotateY(0deg) " +
            "scale3d(1, 1, 1)"

        this.$element.style.willChange = ""
    }

    /**
     * Update element position
     */
    updateElementPosition() {
        let rect    = this.$element.getBoundingClientRect()
        this.width  = this.$element.offsetWidth
        this.height = this.$element.offsetHeight
        this.left   = rect.left
        this.top    = rect.top
    }

    /**
     * Update tilt animation
     */
    update() {
        let values = this.getValues()

        this.$element.style.transform = "perspective(" + this.settings.perspective + "px) " +
            "rotateX(" + (this.settings.axis === "x" ? 0 : values.tiltY) + "deg) " +
            "rotateY(" + (this.settings.axis === "y" ? 0 : values.tiltX) + "deg) " +
            "scale3d(" + this.settings.scale + ", " + this.settings.scale + ", " + this.settings.scale + ")"

        this.$element.dispatchEvent(new CustomEvent("tiltChange", {
            "detail": values
        }))

        this.updateCall = null
    }
}

export default Tilt