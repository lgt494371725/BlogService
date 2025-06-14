import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlogPostForm from './BlogPostForm';
import { BlogPostFormData } from '@/app/lib/blogTypes';

describe('BlogPostForm Component', () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    isLoading: false,
    error: null,
    buttonText: 'Submit',
    currentUser: 'testuser'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with all fields', () => {
    render(<BlogPostForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Content/i)).toBeInTheDocument();
    expect(screen.getByText(/Tags/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: defaultProps.buttonText })).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(<BlogPostForm {...defaultProps} />);

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: 'Test Title' }
    });
    fireEvent.change(screen.getByLabelText(/Content/i), {
      target: { value: 'Test Content' }
    });
    fireEvent.change(screen.getByLabelText(/Summary/i), {
      target: { value: 'Test Summary' }
    });
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. programming/i), {
      target: { value: 'test, blog' }
    });

    // Submit form
    fireEvent.submit(screen.getByRole('button', { name: defaultProps.buttonText }));

    // Verify onSubmit was called with correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Title',
      content: 'Test Content',
      summary: 'Test Summary',
      tags: ['test', 'blog'],
      author: 'testuser'
    });
  });

  it('displays error message when provided', () => {
    const errorMsg = 'Test error message';
    render(<BlogPostForm {...defaultProps} error={errorMsg} />);
    
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it('disables submit button when loading', () => {
    render(<BlogPostForm {...defaultProps} isLoading={true} />);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading text when isLoading is true', () => {
    render(<BlogPostForm {...defaultProps} isLoading={true} />);
    
    expect(screen.getByRole('button')).toHaveTextContent('Processing...');
  });

  it('pre-fills form when initialData is provided', () => {
    const initialData: BlogPostFormData = {
      title: 'Initial Title',
      content: 'Initial Content',
      summary: 'Initial Summary',
      tags: ['initial', 'test'],
      author: 'testuser'
    };

    render(<BlogPostForm {...defaultProps} initialData={initialData} />);
    
    expect(screen.getByLabelText(/Title/i)).toHaveValue(initialData.title);
    expect(screen.getByLabelText(/Content/i)).toHaveValue(initialData.content);
    expect(screen.getByLabelText(/Summary/i)).toHaveValue(initialData.summary);
    expect(screen.getByPlaceholderText(/e\.g\. programming/i)).toHaveValue(initialData.tags.join(', '));
  });
});
