(function($) {

    class Drag {

        constructor(context, id) {

            this.id = id;
            this.context = context;
            this.isInMove = false;

            this.shiftByX = 0;
            this.storedX = 0;

            this.dragHandleStyle = undefined;

            // Inserting elements with corresponding classes.
            this.dragRail = document.createElement('div');
            this.dragRail.className = 'drag__rail';

            this.dragHandle = document.createElement('div');
            this.dragHandle.className = 'drag__handle';

            this.boundMouseDownListener = this.dragMouseDownListener.bind(this);
            this.boundMouseUpListener = this.dragMouseUpListener.bind(this);
            this.boundMouseOutListener = this.dragMouseOutListener.bind(this);

            this.draw();

        }

        draw() {
            this.context.append(this.dragRail);
            this.dragRail.append(this.dragHandle);

            this.addListeners();
        }

        dragMouseDownListener(event) {
            this.isInMove = true;
            this.oldMouseX = event.pageX;
            this.boundMouseMoveListener = this.dragMouseMoveListener.bind(this);
            this.context.addEventListener('mousemove', this.boundMouseMoveListener);
        }

        dragMouseMoveListener(event) {
            if (this.isInMove) {
                let dragEl = this.context;

                let handle = dragEl.querySelector('.drag__handle');
                let handleStyle = getComputedStyle(handle);
                let currentHandlePosition = handleStyle.getPropertyValue('left');
                let dragHandleWidth = handleStyle.getPropertyValue('width');

                let rail = dragEl.querySelector('.drag__rail');
                let railStyle = getComputedStyle(rail);
                let maxStep = railStyle.getPropertyValue('width');

                if (this.isInMove) {
                    this.newMouseX = event.pageX;

                    this.shiftByX = this.newMouseX - this.oldMouseX;

                    if (parseInt(currentHandlePosition) > parseInt(maxStep) - parseInt(dragHandleWidth) / 2) {
                        handle.style.left = (parseInt(maxStep) - parseInt(dragHandleWidth)) + 'px';
                    } else {
                        handle.style.left = (this.storedX + this.shiftByX) + 'px';
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
            this.context.addEventListener('mouseout', this.boundMouseOutListener);
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
