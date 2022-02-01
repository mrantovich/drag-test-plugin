(function($) {

    class Drag {

        constructor(context, id, options) {

            this.id = id;
            this.context = context;
            this.options = options;

            // Variable that need to know if mouse is moving after its button pressed down.
            this.isInMove = false;

            // Variables to get and set coordinates of handles.
            this.leftShiftByX = 0;
            this.rightShiftByX = 0;
            this.leftStoredX = 0;
            this.rightStoredX = 0;

            // Create DOM elements with corresponding classes.
            this.dragRail = document.createElement('div');
            this.dragRail.className = 'drag__rail';

            this.dragHandleLeft = document.createElement('div');
            this.dragHandleLeft.className = 'drag__handle drag__handle_left';
            this.dragHandleRight = document.createElement('div');
            this.dragHandleRight.className = 'drag__handle drag__handle_right';

            this.dragHandleWidth = undefined;

            this.boundMouseDownListener = this.dragMouseDownListener.bind(this);
            this.boundMouseUpListener = this.dragMouseUpListener.bind(this);

            this.draw();

        }

        get absoluteLeftStoredX() {
            return this.leftStoredX;
        }

        set absoluteLeftStoredX(value) {
            this.leftStoredX = value;
        }

        get absoluteRightStoredX() {
            let railStyle = getComputedStyle(this.dragRail);
            let railWidth = parseInt(railStyle.getPropertyValue('width'));
            let absRightX = railWidth - this.rightStoredX;
            return absRightX;
            //return this.rightStoredX;
        }

        set absoluteRightStoredX(value) {
            this.rightStoredX = value;
        }

        draw() {
            // Create DOM structure and add all needed event listeners.
            this.context.append(this.dragRail);
            this.dragRail.append(this.dragHandleLeft);
            this.dragRail.append(this.dragHandleRight);

            // Select handles and set their positions.
            this.leftHandle = this.context.querySelector('.drag__handle_left');
            this.rightHandle = this.context.querySelector('.drag__handle_right');
            this.leftHandle.style.left = 0;
            this.rightHandle.style.right = 0;

            this.dragHandleWidth = this._calculateDragHandleWidth();
            //this.leftStoredX += this.dragHandleWidth;
            //this.rightStoredX -= this.dragHandleWidth;

            // Make handle coloured.
            this.leftHandle.style.background = this.options.bgcolor;
            this.rightHandle.style.background = this.options.bgcolor;

            console.log(this.absoluteLeftStoredX);

            this.addListeners();
        }

        _calculateDragHandleWidth() {
            let ctx = this.context;
            let handle = ctx.querySelector('.drag__handle');
            let handleStyle = getComputedStyle(handle);
            let handleWidth = handleStyle.getPropertyValue('width');

            return parseInt(handleWidth);
        }

        dragMouseDownListener(event) {
            this.isInMove = true;
            this.oldMouseX = event.pageX;
            this.boundMouseMoveListener = this.dragMouseMoveListener.bind(this);
            this.context.addEventListener('mousemove', this.boundMouseMoveListener);
            this.boundMouseOutListener = this.dragMouseOutListener.bind(this);
            this.context.querySelector('.drag__rail').addEventListener('mouseout', this.boundMouseOutListener);
        }

        dragMouseMoveListener(event) {
            //React on mouse movement when mouse button is down.
            if (this.isInMove) {
                let handle = event.target;

                // Compute all needed variables and define minmum and maximum values of range
                // to limit handle movement by them.
                //let handle = dragEl.querySelector('.drag__handle');
                let handleStyle = getComputedStyle(handle);

                let positionProperty;
                // Get current handle position and width and convert them to integer.
                if (event.target.className.includes('drag__handle_left')) {
                    positionProperty = 'left';
                } else {
                    positionProperty = 'right';
                };
                let currentHandlePosition = parseInt(handleStyle.getPropertyValue(positionProperty));
                let dragHandleWidth = parseInt(handleStyle.getPropertyValue('width'));

                //let currentHandlePosition = this.absoluteRightStoredX;

                // Get possible maximum value of rail and convert it to integer to use more compact formula.
                let rail = event.target.parentElement;
                let railStyle = getComputedStyle(rail);
                let maxStep = parseInt(railStyle.getPropertyValue('width'));

                // Store maximum and minimum value;
                //maxStep -= dragHandleWidth;
                let minStep = 0;

                if (this.isInMove) {
                    this.newMouseX = event.pageX;

                    // Reset shift by X when on maximum or minimum.
                    // Or set handle position (absolutly positioned by left or right).
                    if (event.target.className.includes('drag__handle_left')) {
                        this.leftShiftByX = this.newMouseX - this.oldMouseX;
                        console.log(this.leftStoredX);
                        if ((currentHandlePosition > maxStep) && (this.leftShiftByX > 0)) {
                            //this.leftStoredX = maxStep - 1;
                            this.leftShiftByX = 0;
                        } else if ((currentHandlePosition < minStep) && (this.leftShiftByX < 0)) {
                            //this.leftStoredX = minStep + 1;
                            this.leftShiftByX = 0;
                        } else {
                            if ((this.absoluteRightStoredX - this.absoluteLeftStoredX) == (dragHandleWidth * 2)) {
                                console.log('Left is about to right');
                            } else {
                                handle.style.left = this.leftStoredX + this.leftShiftByX + 'px';
                            }
                        };
                    } else {
                        this.rightShiftByX = this.newMouseX - this.oldMouseX;
                        if ((currentHandlePosition > maxStep) && (this.rightShiftByX < 0)) {
                            this.rightStoredX = maxStep + 1;
                            this.rightShiftByX = 0;
                        } else if ((currentHandlePosition < minStep) && (this.rightShiftByX > 0)) {
                            this.rightStoredX = minStep - 1;
                            this.rightShiftByX = 0;
                        } else {
                            if ((this.absoluteRightStoredX - this.absoluteLeftStoredX) <= (dragHandleWidth * 4)) {
                                console.log('Right is about to left');
                                this.rightStoredX = minStep - 1;
                                this.isInMove = false;
                            } else {
                                handle.style.right = this.rightStoredX - this.rightShiftByX + 'px';
                            }
                        };
                    };
                };
            };
        }

        _updateLeftView() {
            this.absoluteLeftStoredX += this.leftShiftByX;
        }

        _updateRightView() {
            this.absoluteRightStoredX = this.rightStoredX + this.rightShiftByX;
        }

        dragMouseUpListener(event) {
            this.isInMove = false;
            if (event.target.className.includes('drag__handle_left')) {
                this.leftStoredX += this.leftShiftByX;
                //this.absoluteLeftStoredX = this.leftStoredX;
            } else {
                this.rightStoredX -= this.rightShiftByX;
                //this.absoluteRightStoredX = this.rightStoredX;
            }
        }

        dragMouseOutListener(event) {
            this.isInMove = false;
        }

        addListeners() {
            this.leftHandle.addEventListener('mousedown', this.boundMouseDownListener);
            this.rightHandle.addEventListener('mousedown', this.boundMouseDownListener);
            this.context.addEventListener('mouseup', this.boundMouseUpListener);
        }

    }

    $.fn.drag = function(options) {

        // Options.
        var settings = $.extend({
            bgcolor: '#880000',
        }, options);

        // Counter to separate instances.
        var idCounter = 0;

        return this.each(function() {

            idCounter++;
            new Drag(this, idCounter, settings);

        });

    };

}(jQuery));
