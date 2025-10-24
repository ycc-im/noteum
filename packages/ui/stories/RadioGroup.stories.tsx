import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '../src/components/ui/radio-group'

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <label
          htmlFor="option-one"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Option One
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <label
          htmlFor="option-two"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Option Two
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="option-three" />
        <label
          htmlFor="option-three"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Option Three
        </label>
      </div>
    </RadioGroup>
  ),
}

export const Vertical: Story = {
  render: () => (
    <RadioGroup defaultValue="default" className="grid gap-2">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <label
          htmlFor="r1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Default
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <label
          htmlFor="r2"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Comfortable
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <label
          htmlFor="r3"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Compact
        </label>
      </div>
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="default" className="flex gap-4">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="h1" />
        <label
          htmlFor="h1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Default
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="h2" />
        <label
          htmlFor="h2"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Comfortable
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="h3" />
        <label
          htmlFor="h3"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Compact
        </label>
      </div>
    </RadioGroup>
  ),
}

export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup defaultValue="small">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="small" id="small" />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="small"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Small
          </label>
          <p className="text-xs text-muted-foreground">
            Choose this option for minimal UI elements.
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="medium" id="medium" />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="medium"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Medium
          </label>
          <p className="text-xs text-muted-foreground">
            Balanced size for most use cases.
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="large" id="large" />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="large"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Large
          </label>
          <p className="text-xs text-muted-foreground">
            Choose this option for emphasis.
          </p>
        </div>
      </div>
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one" disabled>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="disabled-one" disabled />
        <label
          htmlFor="disabled-one"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Disabled Option One
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="disabled-two" disabled />
        <label
          htmlFor="disabled-two"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Disabled Option Two
        </label>
      </div>
    </RadioGroup>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('comfortable')

    return (
      <div className="space-y-4">
        <RadioGroup value={value} onValueChange={setValue}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="c1" />
            <label
              htmlFor="c1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Default
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="comfortable" id="c2" />
            <label
              htmlFor="c2"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Comfortable
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="compact" id="c3" />
            <label
              htmlFor="c3"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Compact
            </label>
          </div>
        </RadioGroup>
        <p className="text-sm text-muted-foreground">Selected: {value}</p>
      </div>
    )
  },
}
