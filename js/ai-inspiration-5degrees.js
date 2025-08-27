// Initialize reveal.js
Reveal.initialize({
    hash: true,
    plugins: [RevealMarkdown, RevealHighlight, RevealNotes],
    transition: 'slide',
    transitionSpeed: 'default',
    backgroundTransition: 'fade'
});

// Progress indicator functionality
function updateProgressIndicator() {
    const currentSlide = Reveal.getCurrentSlide();
    const slideIndex = Reveal.getIndices().h;
    
    // Define section mappings based on horizontal slide index
    // Index 0: Opening slide (intro)
    // Index 1: Introduction section (intro) 
    // Index 2: LLM section
    // Index 3: AI in Way of Working section
    // Index 4: AI in Apps section
    // Index 5: Prompt Engineering section
    // Index 6+: Closing slide (stays on last main section)
    const sections = ['intro', 'intro', 'llm', 'wow', 'apps', 'prompt'];
    const currentSection = sections[Math.min(slideIndex, sections.length - 1)] || 'prompt';
    
    // Update body data attribute
    document.body.setAttribute('data-section', currentSection);
}

// Update progress on ready and slide change
Reveal.on('ready', updateProgressIndicator);
Reveal.on('slidechanged', updateProgressIndicator);