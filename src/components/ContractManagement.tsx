import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Plus, 
  Download, 
  Eye,
  CheckCircle,
  Clock,
  X,
  Send,
  FileSignature
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { mockContracts, Contract } from '../data/contracts';
import { toast } from 'sonner@2.0.3';

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  pending: { label: 'Pending Signature', color: 'bg-yellow-100 text-yellow-800' },
  active: { label: 'Active', color: 'bg-green-100 text-green-800' },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export function ContractManagement() {
  const [contracts, setContracts] = useState(mockContracts);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleSign = (contractId: string) => {
    setContracts(contracts.map(c => 
      c.id === contractId 
        ? { ...c, signedByBuyer: true, status: c.signedByFarmer ? 'active' as const : 'pending' as const }
        : c
    ));
    toast.success('Contract signed successfully!');
  };

  const handleDownload = (contract: Contract) => {
    toast.success('Contract downloaded as PDF');
  };

  const viewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setIsViewOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Contract Management</h2>
          <p className="text-gray-600 text-sm">
            Manage your purchase agreements and contracts
          </p>
        </div>
        <Button className="gap-2 bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4" />
          New Contract
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Active</div>
              <div className="text-2xl">{contracts.filter(c => c.status === 'active').length}</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Pending</div>
              <div className="text-2xl">{contracts.filter(c => c.status === 'pending').length}</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Completed</div>
              <div className="text-2xl">{contracts.filter(c => c.status === 'completed').length}</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileSignature className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Value</div>
              <div className="text-xl">₹{(contracts.reduce((sum, c) => sum + c.totalAmount, 0) / 100000).toFixed(1)}L</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {contracts.map((contract, index) => (
          <motion.div
            key={contract.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 border-2 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl">{contract.id}</h3>
                    <Badge className={statusConfig[contract.status].color}>
                      {statusConfig[contract.status].label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <div className="text-gray-500 mb-1">Farm</div>
                      <div>{contract.farmName}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Crop</div>
                      <div>{contract.cropType} - {contract.quantity} {contract.unit}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Contract Value</div>
                      <div className="text-green-600">₹{contract.totalAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Duration</div>
                      <div>{new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      {contract.signedByBuyer ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                      <span>Buyer Signed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {contract.signedByFarmer ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                      <span>Farmer Signed</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewContract(contract)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(contract)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  {!contract.signedByBuyer && (
                    <Button
                      size="sm"
                      onClick={() => handleSign(contract.id)}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <FileSignature className="h-4 w-4" />
                      Sign
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* View Contract Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
            <DialogDescription>
              Review the complete contract agreement
            </DialogDescription>
          </DialogHeader>

          {selectedContract && (
            <div className="space-y-6">
              <div className="border-2 border-gray-200 rounded-lg p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl mb-2">PURCHASE AGREEMENT</h3>
                  <p className="text-gray-600">Contract ID: {selectedContract.id}</p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium mb-2">Seller Details</div>
                      <div className="text-gray-600">
                        <div>Farm: {selectedContract.farmName}</div>
                        <div>Crop: {selectedContract.cropType}</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-2">Buyer Details</div>
                      <div className="text-gray-600">
                        <div>Name: {selectedContract.buyerName}</div>
                      </div>
                    </div>
                  </div>

                  <hr />

                  <div>
                    <div className="font-medium mb-2">Contract Terms</div>
                    <div className="grid grid-cols-2 gap-4 text-gray-600">
                      <div>
                        <span className="font-medium">Quantity:</span> {selectedContract.quantity} {selectedContract.unit}
                      </div>
                      <div>
                        <span className="font-medium">Price:</span> ₹{selectedContract.pricePerUnit.toLocaleString()}/{selectedContract.unit}
                      </div>
                      <div>
                        <span className="font-medium">Total Amount:</span> ₹{selectedContract.totalAmount.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {new Date(selectedContract.startDate).toLocaleDateString()} to {new Date(selectedContract.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium mb-2">Delivery Schedule</div>
                    <p className="text-gray-600">{selectedContract.deliverySchedule}</p>
                  </div>

                  <div>
                    <div className="font-medium mb-2">Payment Terms</div>
                    <p className="text-gray-600">{selectedContract.paymentTerms}</p>
                  </div>

                  <div>
                    <div className="font-medium mb-2">Quality Standards</div>
                    <ul className="list-disc list-inside text-gray-600">
                      {selectedContract.qualityStandards.map((standard, idx) => (
                        <li key={idx}>{standard}</li>
                      ))}
                    </ul>
                  </div>

                  <hr />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded">
                      <div className="font-medium mb-2">Buyer Signature</div>
                      {selectedContract.signedByBuyer ? (
                        <div className="text-green-600 flex items-center justify-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Signed
                        </div>
                      ) : (
                        <div className="text-gray-400">Pending</div>
                      )}
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded">
                      <div className="font-medium mb-2">Farmer Signature</div>
                      {selectedContract.signedByFarmer ? (
                        <div className="text-green-600 flex items-center justify-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Signed
                        </div>
                      ) : (
                        <div className="text-gray-400">Pending</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(selectedContract)}
                  className="gap-2 flex-1"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                {!selectedContract.signedByBuyer && (
                  <Button
                    onClick={() => {
                      handleSign(selectedContract.id);
                      setIsViewOpen(false);
                    }}
                    className="gap-2 flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <FileSignature className="h-4 w-4" />
                    Sign Contract
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
