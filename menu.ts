namespace blockMenu {
    class LayoutMetrics {
        constructor(public left: number, public top: number, public width: number, public height: number) {
        }

        get right() {
            return this.left + this.width;
        }

        get bottom() {
            return this.top + this.height;
        }
    }

    export class MenuSprite extends sprites.BaseSprite {
        protected location: MenuLocation;

        protected options: string[];
        protected labels: ScrollingLabel[];
        protected selectedIndex: number;

        protected foreground: number;
        protected background: number;
        protected cursorBackground: number;
        protected cursorForeground: number;
        protected open: boolean;

        protected padding: number;
        protected metrics: LayoutMetrics;

        constructor() {
            super(100);
            this.selectedIndex = 0;
            this.setLocation(MenuLocation.Center);
            this.open = false;
            this.setColors(15, 1, 1, 3);
            this.padding = 2;
        }

        protected gridCol = 1

        setGridCol(col: number) {
            this.gridCol = Math.ceil(Math.max(1, col))
            this.recreateLabels();
        }

        protected iconPadding = 1
        protected icons: Image[] = null

        setIcons(icons: Image[]) {
            this.icons = icons
            this.recreateLabels();
        }

        setOptions(options: string[]) {
            this.options = options.slice();
            this.selectedIndex = 0;
            this.recreateLabels();
        }

        setColors(foreground: number, background: number, cursorForeground: number, cursorBackground: number) {
            this.foreground = Math.max(Math.min(foreground | 0, 15), 0);
            this.background = Math.max(Math.min(background | 0, 15), 0);
            this.cursorForeground = Math.max(Math.min(cursorForeground | 0, 15), 0);
            this.cursorBackground = Math.max(Math.min(cursorBackground | 0, 15), 0);
        }

        setLocation(location: MenuLocation) {
            this.location = location;
            this.metrics = getLayoutMetrics(location);
            this.recreateLabels();
        }

        selectedMenuOption(): string {
            if (!this.options || !this.options[this.selectedIndex]) {
                return "";
            }

            return this.options[this.selectedIndex];
        }

        selectedMenuIndex(): number {
            return this.selectedIndex;
        }

        setSelectedIndex(index: number) {
            const numOptions = this.options ? this.options.length : 0;
            if (!numOptions) return;

            index |= 0;
            while (index < 0) index += this.options.length;

            index = index % numOptions;

            if (this.labels && this.labels[this.selectedIndex]) {
                this.labels[this.selectedIndex].setScrolling(false);
            }

            this.selectedIndex = index;

            if (this.labels && this.labels[this.selectedIndex]) {
                this.labels[this.selectedIndex].setScrolling(true);
            }
        }

        moveSelectionVertical(up: boolean) {
            if (up)
                this.setSelectedIndex(this.selectedIndex - this.gridCol)
            else
                this.setSelectedIndex(this.selectedIndex + this.gridCol)
        }

        moveSelectionHorizontal(left: boolean) {
            if (left) {
                this.setSelectedIndex(this.selectedIndex - 1);
            }
            else {
                this.setSelectedIndex(this.selectedIndex + 1);
            }
        }

        setSelectedOption(option: string) {
            const index = this.options ? this.options.indexOf(option) : -1;

            if (index !== -1) {
                this.setSelectedIndex(index);
            }
        }

        isOpen(): boolean {
            return this.open;
        }

        setMenuOpen(open: boolean) {
            this.open = open;
        }

        destroy() {
            game.currentScene().allSprites.removeElement(this);
        }

        __visible(): boolean {
            return this.open;
        }

        __drawCore(camera: scene.Camera) {
            if (this.background) {
                screen.fillRect(
                    this.metrics.left,
                    this.metrics.top,
                    this.metrics.width,
                    this.metrics.height,
                    this.background
                );
            }

            this.drawMenu();
        }

        protected getMaxLabelWidth() {
            return Math.idiv((this.metrics.width - this.padding), this.gridCol) - this.padding;
        }

        protected recreateLabels() {
            this.labels = [];
            if (!this.options) return;

            const labelWidth = this.getMaxLabelWidth();

            for (let i = 0; i < this.options.length; i++) {
                const option = this.options[i]
                this.labels.push(new ScrollingLabel(option, labelWidth, (this.icons && this.icons[i]) ? this.icons[i] : null));
            }

            this.setSelectedIndex(this.selectedMenuIndex())
        }

        protected drawMenu() {
            let current: ScrollingLabel;

            let top = this.metrics.top + this.padding;
            let left = this.metrics.left + this.padding;

            let maxItemHeight = 0
            for (let i = 0; i < this.labels.length; i++) {
                current = this.labels[i];

                if (i === this.selectedIndex) {
                    screen.fillRect(left - 1, top - 1, current.width + 2, current.height + 2, this.cursorBackground);
                    current.draw(left, top, this.cursorForeground);
                }
                else {
                    current.draw(left, top, this.foreground);
                }

                maxItemHeight = Math.max(current.height, maxItemHeight)
                if ((i + 1) % this.gridCol === 0) {
                    left = this.metrics.left + this.padding;
                    top += maxItemHeight + this.padding;
                    maxItemHeight = 0
                }
                else {
                    left += current.width + this.padding;
                }
            }
        }
    }

    class ScrollingLabel {
        public offset: number;

        public stage: number;
        public timer: number;
        public scrolling: boolean;
        public pauseTime: number;
        public maxCharacters: number;
        public maxOffset: number;
        public width: number;
        public font: image.Font;
        public partialCanvas: Image;

        public height: number
        protected iconPadding = 1
        protected icon: Image = null

        constructor(public text: string, maxWidth: number, icon?: Image) {
            this.scrolling = false;

            this.pauseTime = 1000;
            this.timer = this.pauseTime;
            this.stage = 0;
            this.offset = 0;
            this.width = maxWidth;

            this.font = image.getFontForText(this.text);
            this.height = this.font.charHeight

            this.icon = icon
            if (this.icon) {
                maxWidth = Math.max(0, maxWidth - this.icon.width)
                this.height = Math.max(this.icon.height, this.font.charHeight)
            }

            const fullLength = this.text.length * this.font.charWidth;
            this.maxCharacters = Math.idiv(maxWidth, this.font.charWidth);
            this.maxOffset = fullLength - this.maxCharacters * this.font.charWidth;
            this.partialCanvas = image.create(this.font.charWidth, this.font.charHeight);
        }

        setScrolling(scrolling: boolean) {
            if (this.scrolling !== scrolling) {
                this.stage = 0;
                this.offset = 0;
                this.scrolling = scrolling;
            }
        }

        draw(left: number, top: number, color: number) {
            if (this.icon) {
                screen.drawTransparentImage(this.icon, left + this.iconPadding, top)
                left += this.icon.width + this.iconPadding * 2
            }

            const startIndex = Math.idiv(this.offset, this.font.charWidth);
            const letterOffset = startIndex * this.font.charWidth - this.offset;

            if (!this.scrolling) {
                this.offset = 0;
            }
            else if (this.stage === 1) {
                this.offset++;
                if (this.offset >= this.maxOffset) {
                    this.stage++;
                    this.offset = Math.max(this.maxOffset, 0);
                }
            }
            else {
                if (this.stage === 0) {
                    this.offset = 0;
                }
                else if (this.stage === 2) {
                    this.offset = Math.max(this.maxOffset, 0);
                }

                this.timer -= game.currentScene().eventContext.deltaTimeMillis;

                if (this.timer < 0) {
                    this.stage = (this.stage + 1) % 3;
                    this.timer = this.pauseTime;
                }
            }

            if (letterOffset) {
                this.partialCanvas.fill(0);
                this.partialCanvas.print(this.text.charAt(startIndex), letterOffset, 0, color, this.font)
                screen.drawTransparentImage(this.partialCanvas, left, top);
            }
            else {
                screen.print(this.text.charAt(startIndex), left, top, color, this.font);
            }

            for (let i = 1; i < this.maxCharacters; i++) {
                screen.print(
                    this.text.charAt(startIndex + i),
                    left + i * this.font.charWidth + letterOffset,
                    top,
                    color,
                    this.font
                );
            }
        }
    }

    function getLayoutMetrics(layout: MenuLocation) {
        const padding = 2;

        const maxWidth = screen.width - (padding << 1);
        const maxHeight = screen.height - (padding << 1);

        switch (layout) {
            case MenuLocation.FullScreen:
                return new LayoutMetrics(padding, padding, maxWidth, maxHeight);
            case MenuLocation.Center:
                return new LayoutMetrics(0, 0, 0, 0);
            case MenuLocation.TopHalf:
                return new LayoutMetrics(padding, padding, maxWidth, maxHeight >> 1);
            case MenuLocation.RightHalf:
                return new LayoutMetrics(screen.width >> 1, padding, maxWidth >> 1, maxHeight);
            case MenuLocation.BottomHalf:
                return new LayoutMetrics(padding, screen.height >> 1, maxWidth, maxHeight >> 1);
            case MenuLocation.LeftHalf:
                return new LayoutMetrics(padding, padding, maxWidth >> 1, maxHeight);
            case MenuLocation.TopRight:
                return new LayoutMetrics(screen.width >> 1, padding, maxWidth >> 1, maxHeight >> 1);
            case MenuLocation.BottomRight:
                return new LayoutMetrics(screen.width >> 1, screen.height >> 1, maxWidth >> 1, maxHeight >> 1);
            case MenuLocation.BottomLeft:
                return new LayoutMetrics(padding, screen.height >> 1, maxWidth >> 1, maxHeight >> 1);
            case MenuLocation.TopLeft:
                return new LayoutMetrics(padding, padding, maxWidth >> 1, maxHeight >> 1);
        }
    }
}