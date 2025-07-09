import type { Invoice } from "@/data-access/payment/formatters";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Menu } from "@/shared/components/ui/menu";
import { Table } from "@/shared/components/ui/table";
import {
  Download01Icon,
  Invoice02Icon,
  Link02Icon,
  MoreHorizontalIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns";

const getStatusBadgeProps = (status: string | null) => {
  switch (status) {
    case "paid":
      return { intent: "success" as const, label: "Paid" };
    case "open":
      return { intent: "warning" as const, label: "Open" };
    case "void":
      return { intent: "secondary" as const, label: "Void" };
    case "draft":
      return { intent: "info" as const, label: "Draft" };
    case "uncollectible":
      return { intent: "danger" as const, label: "Uncollectible" };
    default:
      return { intent: "secondary" as const, label: status || "Unknown" };
  }
};

const formatAmount = (amount: number, currency: string) => {
  return `${currency}${amount.toFixed(2)}`;
};

export const InvoiceList = ({
  invoices,
}: {
  invoices: NonNullable<Invoice>[];
}) => {
  if (invoices.length === 0) {
    return (
      <Card className="shadow-md">
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <HugeiconsIcon icon={Invoice02Icon} size={20} />
            Recent Invoices
          </Card.Title>
          <Card.Description>
            Your billing history will appear here
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="text-center py-8 text-muted-fg">
            <HugeiconsIcon
              icon={Invoice02Icon}
              size={48}
              className="mx-auto mb-3 opacity-50"
            />
            <p>No invoices found</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className="pb-0">
      <Card.Header>
        <Card.Title>Recent Invoices</Card.Title>
        <Card.Description>
          Your latest {invoices.length} invoice
          {invoices.length !== 1 ? "s" : ""}
        </Card.Description>
      </Card.Header>

      <Card.Content>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Column isRowHeader>Date</Table.Column>
              <Table.Column isRowHeader>Description</Table.Column>
              <Table.Column isRowHeader>Status</Table.Column>
              <Table.Column isRowHeader className="text-right">
                Amount
              </Table.Column>
              <Table.Column isRowHeader className="text-right">
                Actions
              </Table.Column>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {invoices.map((invoice) => {
              const statusProps = getStatusBadgeProps(invoice.status);
              const hasActions = invoice.invoicePdf || invoice.hostedInvoiceUrl;

              return (
                <Table.Row
                  key={invoice.id}
                  className="h-14 border-b-0 not-last:border-b first:border-t"
                >
                  <Table.Cell>
                    <span className="text-sm">
                      {format(invoice.created, "MMM d, yyyy")}
                    </span>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {invoice.description || "Subscription"}
                      </span>
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <Badge
                      intent={statusProps.intent}
                      shape="square"
                      className="text-xs"
                    >
                      {statusProps.label}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell className="text-right">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {formatAmount(invoice.total, invoice.currency)}
                      </span>
                      {invoice.amountDue > 0 && (
                        <span className="text-xs text-muted-fg">
                          Due:{" "}
                          {formatAmount(invoice.amountDue, invoice.currency)}
                        </span>
                      )}
                    </div>
                  </Table.Cell>

                  <Table.Cell className="text-right">
                    {hasActions ? (
                      <Menu>
                        <Button
                          intent="outline"
                          size="small"
                          className="h-7 w-7 p-0"
                        >
                          <HugeiconsIcon icon={MoreHorizontalIcon} size={12} />
                        </Button>
                        <Menu.Content placement="bottom end">
                          {invoice.invoicePdf && (
                            <Menu.Item
                              onAction={() =>
                                window.open(invoice.invoicePdf!, "_blank")
                              }
                            >
                              <HugeiconsIcon
                                icon={Download01Icon}
                                size={16}
                                data-slot="icon"
                              />
                              <Menu.Label>Download PDF</Menu.Label>
                            </Menu.Item>
                          )}
                          {invoice.hostedInvoiceUrl && (
                            <Menu.Item
                              onAction={() =>
                                window.open(invoice.hostedInvoiceUrl!, "_blank")
                              }
                            >
                              <HugeiconsIcon
                                icon={Link02Icon}
                                size={16}
                                data-slot="icon"
                              />
                              <Menu.Label>View Invoice</Menu.Label>
                            </Menu.Item>
                          )}
                        </Menu.Content>
                      </Menu>
                    ) : (
                      <span className="text-xs text-muted-fg">—</span>
                    )}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Card.Content>
    </Card>
  );
};
