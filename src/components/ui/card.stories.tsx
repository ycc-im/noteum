import type { Meta, StoryObj } from '@storybook/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card'

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This is where you can put your main content.</p>
      </CardContent>
      <CardFooter>
        <p>Card footer content</p>
      </CardFooter>
    </Card>
  ),
}

export const WithoutHeader: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p>Card content without header. Just the content area.</p>
      </CardContent>
    </Card>
  ),
}

export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content without footer. Just the header and content.</p>
      </CardContent>
    </Card>
  ),
}

export const Minimal: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p>Minimal card with only content.</p>
      </CardContent>
    </Card>
  ),
}

export const WithActions: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Project</CardTitle>
        <CardDescription>
          Deploy your new project in one-click.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Configure your project settings and deploy to production.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <button variant="outline" className="px-4 py-2 border rounded-md">
          Cancel
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Deploy
        </button>
      </CardFooter>
    </Card>
  ),
}

export const LongContent: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Long Content Card</CardTitle>
        <CardDescription>
          This card demonstrates how it handles longer content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur.
          </p>
        </div>
      </CardContent>
    </Card>
  ),
}