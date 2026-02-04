import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FAQSection } from '../../components/landing/FAQSection';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

describe('FAQSection Component', () => {
    it('should render the FAQ section title', () => {
        render(<FAQSection />);

        expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    });

    it('should render all FAQ items', () => {
        render(<FAQSection />);

        expect(screen.getByText('Is PadhLoYaarAI really free?')).toBeInTheDocument();
        expect(screen.getByText('What subjects can I study with PadhLoYaarAI?')).toBeInTheDocument();
        expect(screen.getByText('How is this different from ChatGPT?')).toBeInTheDocument();
    });

    it('should have a link to the help center', () => {
        render(<FAQSection />);

        const helpLink = screen.getByText('Visit our Help Center');
        expect(helpLink).toBeInTheDocument();
        expect(helpLink).toHaveAttribute('href', '/help');
    });

    it('should render accordion items', () => {
        render(<FAQSection />);

        // Check that accordion triggers exist
        const accordionItems = screen.getAllByRole('button');
        expect(accordionItems.length).toBeGreaterThan(0);
    });
});
