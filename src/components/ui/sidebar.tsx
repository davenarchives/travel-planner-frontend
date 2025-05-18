
import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type SidebarContextValue = {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  collapsedWidth: number
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultCollapsed?: boolean
  collapsedWidth?: number
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
  collapsedWidth = 56,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)
  
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, collapsedWidth }}>
      {children}
    </SidebarContext.Provider>
  )
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  collapsible?: boolean
}

export function Sidebar({
  children,
  className,
  collapsible = false,
  ...props
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "sidebar flex h-full flex-col border-r bg-background text-sidebar-foreground transition-width duration-300",
        className
      )}
      {...props}
      data-collapsible={collapsible}
    >
      {children}
    </aside>
  )
}

export function SidebarHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <header
      className={cn("flex h-14 items-center border-b px-4", className)}
      {...props}
    >
      {children}
    </header>
  )
}

export function SidebarContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-1 flex-col overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SidebarGroup({
  children,
  className,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  ...props
}: SidebarGroupProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen
  
  function handleOpenChange(open: boolean) {
    if (isControlled && onOpenChange) {
      onOpenChange(open)
    } else {
      setUncontrolledOpen(open)
    }
  }
  
  return (
    <div
      className={cn("sidebar-group", className)}
      data-open={isOpen}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            groupOpen: isOpen,
            onOpenChange: handleOpenChange,
          })
        }
        return child
      })}
    </div>
  )
}

interface SidebarGroupContextValue {
  groupOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const SidebarGroupContext = React.createContext<SidebarGroupContextValue>({})

export function SidebarGroupLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & SidebarGroupContextValue) {
  const { groupOpen, onOpenChange } = React.useContext(SidebarGroupContext)
  const { collapsed } = useSidebar()
  
  return (
    <div
      className={cn(
        "flex h-9 cursor-pointer items-center justify-between px-3 text-xs font-medium text-sidebar-foreground/70",
        className
      )}
      onClick={() => onOpenChange?.(!groupOpen)}
      {...props}
    >
      <span className={cn(collapsed && "sr-only")}>{children}</span>
      {!collapsed && onOpenChange && (
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform",
            groupOpen && "rotate-90 transform"
          )}
        />
      )}
    </div>
  )
}

export function SidebarGroupContent({
  className,
  children,
  groupOpen = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & SidebarGroupContextValue) {
  return (
    <div
      className={cn(
        "overflow-hidden",
        !groupOpen && "h-0",
        groupOpen && "animate-accordion-down",
        !groupOpen && "animate-accordion-up",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarMenu({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn("flex flex-col gap-1 px-2", className)} {...props}>
      {children}
    </ul>
  )
}

export function SidebarMenuItem({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className={cn(className)} {...props}>
      {children}
    </li>
  )
}

interface SidebarMenuButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

export function SidebarMenuButton({
  className,
  children,
  asChild = false,
  ...props
}: SidebarMenuButtonProps) {
  const Comp = asChild ? React.Fragment : "div"
  const childProps = asChild ? {} : {
    className: cn(
      "flex h-9 cursor-pointer select-none items-center rounded-md px-3 text-sm transition-colors hover:bg-sidebar-hover",
      className
    ),
    ...props
  }
  
  return <Comp {...childProps}>{children}</Comp>
}

export function SidebarFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <footer
      className={cn("mt-auto border-t p-4", className)}
      {...props}
    >
      {children}
    </footer>
  )
}

export function SidebarTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  const { collapsed, setCollapsed } = useSidebar()
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={() => setCollapsed(!collapsed)}
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      {...props}
    >
      {collapsed ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
      <span className="sr-only">
        {collapsed ? "Expand sidebar" : "Collapse sidebar"}
      </span>
    </Button>
  )
}
