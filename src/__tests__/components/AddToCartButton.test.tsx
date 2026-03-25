import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AddToCartButton from '@/components/detail/AddToCartButton';

describe('AddToCartButton', () => {
  it('renders the button text', () => {
    render(<AddToCartButton disabled={false} onClick={() => {}} />);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
    expect(screen.getByText('Añadir')).toBeInTheDocument();
  });

  it('is disabled when prop is true', () => {
    render(<AddToCartButton disabled={true} onClick={() => {}} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when enabled and clicked', () => {
    const onClick = vi.fn();
    render(<AddToCartButton disabled={false} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<AddToCartButton disabled={true} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
