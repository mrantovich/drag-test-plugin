(function($) {

    class Drag {

        constructor(context, id) {

            this.id = id;
            this.context = context;

            // Variable that need to know if mouse is moving after its button pressed down.
            this.isInMove = false;

            // Variables to get and set coordinates of handle.
            this.shiftByX = 0;
            this.storedX = 0;

            // Create DOM elements with corresponding classes.
            this.dragRail = document.createElement('div');
            this.dragRail.className = 'drag__rail';

            this.dragHandle = document.createElement('div');
            this.dragHandle.className = 'drag__handle';

            this.boundMouseDownListener = this.dragMouseDownListener.bind(this);
            this.boundMouseUpListener = this.dragMouseUpListener.bind(this);

            this.draw();

        }

        draw() {
            // Create DOM structure and add all needed event listeners.
            this.context.append(this.dragRail);
            this.dragRail.append(this.dragHandle);

            this.addListeners();
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
                let dragEl = this.context;

                // Compute all needed variables and define minmum and maximum values of range
                // to limit handle movement by them.
                let handle = dragEl.querySelector('.drag__handle');
                let handleStyle = getComputedStyle(handle);

                // Get current handle position and width and convert them to integer.
                let currentHandlePosition = parseInt(handleStyle.getPropertyValue('left'));
                let dragHandleWidth = parseInt(handleStyle.getPropertyValue('width'));

                // Get possible maximum value of rail and convert it to integer to use more compact formula.
                let rail = dragEl.querySelector('.drag__rail');
                let railStyle = getComputedStyle(rail);
                let maxStep = railStyle.getPropertyValue('width');

                // Store maximum and minimum value;
                maxStep -= dragHandleWidth;
                let minStep = 0;

                if (this.isInMove) {
                    this.newMouseX = event.pageX;

                    this.shiftByX = this.newMouseX - this.oldMouseX;

                    // Reset this.shiftByX when on maximum or minimum.
                    // Or set handle position (absolutly positioned by left).
                    if ((currentHandlePosition > maxStep) && (this.shiftByX > 0)) {
                        this.storedX = maxStep - 1;
                        this.shiftByX = 0;
                    } else if ((currentHandlePosition < minStep) && (this.shiftByX < 0)) {
                        this.storedX = minStep + 1;
                        this.shiftByX = 0;
                    } else {
                        handle.style.left = this.storedX + this.shiftByX + 'px';
                    };

                    
                };
            };
        }

        dragMouseUpListener(event) {
            this.isInMove = false;
            this.storedX += this.shiftByX;
        }

        dragMouseOutListener(event) {
            this.isInMove = false;
        }

        addListeners() {
            this.context.addEventListener('mousedown', this.boundMouseDownListener);
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
            new Drag(this, idCounter);

        });

    };

}(jQuery));
