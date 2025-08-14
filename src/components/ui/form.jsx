import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Controller, FormProvider, useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

const FormField = ({ ...props }) => {
  return (
    <Controller
      {...props}
      render={({ field, formState, fieldState }) => {
        return props.render({ field, formState, fieldState })
      }}
    />
  )
}

const FormItemContext = React.createContext({})

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormContext()
  const { id } = React.useContext(FormItemContext)

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId || id}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { id } = React.useContext(FormItemContext)
  const { field } = useFormContext()

  return (
    <Slot
      ref={ref}
      id={id}
      aria-describedby={`${id}-description ${id}-error`}
      aria-invalid={!!field?.error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { id } = React.useContext(FormItemContext)

  return (
    <p
      ref={ref}
      id={`${id}-description`}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  const { id } = React.useContext(FormItemContext)
  const { formState } = useFormContext()

  const body = formState.errors[id]?.message || children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={`${id}-error`}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body.toString()}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormContext,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}
