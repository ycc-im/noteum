import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Checkbox } from './checkbox'
import { Button } from './button'

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
}

export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms-checked" defaultChecked />
      <label
        htmlFor="terms-checked"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms-disabled" disabled />
      <label
        htmlFor="terms-disabled"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
}

export const WithIndeterminate: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="select-all" />
        <label
          htmlFor="select-all"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Select all (indeterminate state)
        </label>
      </div>
      <div className="ml-6 space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="option-1" defaultChecked />
          <label
            htmlFor="option-1"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Option 1
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="option-2" />
          <label
            htmlFor="option-2"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Option 2
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="option-3" defaultChecked />
          <label
            htmlFor="option-3"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Option 3
          </label>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Partial selection (2 of 3 selected)
      </p>
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="controlled"
            checked={checked}
            onCheckedChange={(newChecked) => setChecked(newChecked === true)}
          />
          <label
            htmlFor="controlled"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Controlled checkbox
          </label>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setChecked(true)}>
            Check
          </Button>
          <Button size="sm" variant="outline" onClick={() => setChecked(false)}>
            Uncheck
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setChecked(!checked)}
          >
            Toggle
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Checkbox is {checked ? 'checked' : 'unchecked'}
        </p>
      </div>
    )
  },
}

export const Multiple: Story = {
  render: () => {
    const [terms, setTerms] = useState(false)
    const [marketing, setMarketing] = useState(false)
    const [notifications, setNotifications] = useState(true)

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Preferences</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={terms}
              onCheckedChange={(checked) => setTerms(checked === true)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              I accept the terms and conditions
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="marketing"
              checked={marketing}
              onCheckedChange={(checked) => setMarketing(checked === true)}
            />
            <label
              htmlFor="marketing"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              I want to receive marketing emails
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notifications"
              checked={notifications}
              onCheckedChange={(checked) => setNotifications(checked === true)}
            />
            <label
              htmlFor="notifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              I want to receive notifications
            </label>
          </div>
        </div>
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Selected options:
            {[
              terms && 'terms',
              marketing && 'marketing',
              notifications && 'notifications',
            ]
              .filter(Boolean)
              .join(', ') || 'none'}
          </p>
        </div>
      </div>
    )
  },
}

export const WithForm: Story = {
  render: () => {
    const [email, setEmail] = useState('')
    const [newsletter, setNewsletter] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      alert(`Form submitted with: ${email}, Newsletter: ${newsletter}`)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="newsletter"
            checked={newsletter}
            onCheckedChange={(checked) => setNewsletter(checked === true)}
          />
          <label
            htmlFor="newsletter"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Subscribe to newsletter
          </label>
        </div>
        <Button type="submit">Subscribe</Button>
      </form>
    )
  },
}
