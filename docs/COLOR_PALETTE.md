# Color Palette

This document defines the color palette for the CaligraphME frontend application.

## Primary Colors

| Color Name | Hex Code | Preview |
|------------|----------|---------|
| Bright Red | `#FF3B30` | ![#FF3B30](https://via.placeholder.com/50x30/FF3B30/FF3B30.png) |
| Sunshine Yellow | `#FFD60A` | ![#FFD60A](https://via.placeholder.com/50x30/FFD60A/FFD60A.png) |
| Sky Blue | `#4DA6FF` | ![#4DA6FF](https://via.placeholder.com/50x30/4DA6FF/4DA6FF.png) |
| Grass Green | `#4CD964` | ![#4CD964](https://via.placeholder.com/50x30/4CD964/4CD964.png) |
| Tangerine Orange | `#FF9500` | ![#FF9500](https://via.placeholder.com/50x30/FF9500/FF9500.png) |

## Usage Guidelines

These colors are intended to create a vibrant, child-friendly, and engaging user interface for the CaligraphME application.

### Color Applications

- **Bright Red** (`#FF3B30`): Use for alerts, errors, or important call-to-action elements
- **Sunshine Yellow** (`#FFD60A`): Use for highlights, rewards, or positive feedback
- **Sky Blue** (`#4DA6FF`): Use for primary interactive elements, links, or information displays
- **Grass Green** (`#4CD964`): Use for success states, completion indicators, or positive actions
- **Tangerine Orange** (`#FF9500`): Use for secondary actions, warnings, or energetic elements

## Implementation

The color palette has been implemented in the frontend using CSS custom properties defined in `frontend/src/styles/index.css`:

```css
:root {
  --primary-color: #4DA6FF;        /* Sky Blue */
  --secondary-color: #FF9500;      /* Tangerine Orange */
  --success-color: #4CD964;        /* Grass Green */
  --error-color: #FF3B30;          /* Bright Red */
  --warning-color: #FFD60A;        /* Sunshine Yellow */
}
```

### Usage Throughout Application

- **Sky Blue (`#4DA6FF`)**: Primary buttons, links, active navigation items, progress bars, advanced level badges
- **Tangerine Orange (`#FF9500`)**: Secondary actions, intermediate level badges, energetic UI elements
- **Grass Green (`#4CD964`)**: Success messages, completion indicators, beginner level badges
- **Bright Red (`#FF3B30`)**: Error messages, error banners, alerts
- **Sunshine Yellow (`#FFD60A`)**: Highlights, rewards, warnings, positive feedback

### Accessibility Notes

- All colors have been tested for sufficient contrast ratios when used with white backgrounds
- Text colors use proper contrast for readability
- Interactive elements have visible hover states for better UX

