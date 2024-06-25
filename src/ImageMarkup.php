<?php

namespace Adamtrll\NovaImageMarkupField;

use Laravel\Nova\Fields\Image;

class ImageMarkup extends Image
{
    /**
     * The field's component.
     *
     * @var string
     */
    public $component = 'image-markup';
}
